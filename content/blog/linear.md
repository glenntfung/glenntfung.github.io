In the age of transformers and billion-parameter LLMs, it’s easy to forget that linear models often deliver competitive accuracy, transparent coefficients, and lightning-fast training—especially on high-dimensional sparse data or low-signal tabular problems. Two short experiments below back up that claim. The code and output are also available [in this repo](https://github.com/glenntfung/linear-vs-complex). 

## Experiment A: Movie-Review Sentiment

**Task** Binary sentiment (IMDb).

**Setup** Bag-of-words → TF–IDF (5,000 terms)

**Models** Logistic Regression vs. 1-hidden-layer Neural Net (100 ReLUs)

**Metric** Accuracy on the official test split (25,000 reviews).

```python
import numpy as np, tensorflow as tf
from tensorflow.keras.datasets import imdb
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split

np.random.seed(42)

# Load and decode
(num_words, test_size) = (5000, 0.2)
(x_train, y_train), (x_test, y_test) = imdb.load_data(num_words=num_words)
word_index = imdb.get_word_index()
index_to_word = {i+3: w for w, i in word_index.items()}
index_to_word.update({0: '<pad>', 1: '<start>', 2: '<unk>'})
decode = lambda seqs: [" ".join(index_to_word.get(i, '?') for i in s) for s in seqs]
texts_train, texts_test = map(decode, (x_train, x_test))

# TF–IDF split
tx_train, tx_val, ty_train, ty_val = train_test_split(
    texts_train, y_train, test_size=test_size, random_state=42)
vec = TfidfVectorizer(max_features=num_words)
X_tr, X_val, X_te = map(lambda d: vec.fit_transform(d) if d is tx_train else vec.transform(d),
                        (tx_train, tx_val, texts_test))

# Logistic Regression
logreg = LogisticRegression(max_iter=500, random_state=42).fit(X_tr, ty_train)
acc_logreg = accuracy_score(y_test, logreg.predict(X_te))

# Shallow NN
nn = tf.keras.Sequential([
    tf.keras.layers.InputLayer(X_tr.shape[1]),
    tf.keras.layers.Dense(100, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])
nn.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
nn.fit(X_tr.toarray(), ty_train, epochs=5, batch_size=128, verbose=0)
acc_nn = nn.evaluate(X_te.toarray(), y_test, verbose=0)[1]

print(f"LogReg test acc = {acc_logreg:.3f} | NN test acc = {acc_nn:.3f}")
```

**Result** `LogReg = 0.879`, `NN = 0.873`. 

On sparse word counts, the linear decision boundary is already near-optimal.


## Experiment B: Diabetes Risk, Low-Signal

**Task** Predict a clinical score (`target`) from 10 numerical attributes.

**Twist** Add heavy Gaussian noise ($\sigma = 70$) to halve the signal-to-noise ratio.

**Models** Linear with OLS vs. XGBoost.

**Metric** MSE.

```python
import numpy as np, pandas as pd
from sklearn.datasets import load_diabetes
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from xgboost import XGBRegressor

# Data & polynomial features
X, y = load_diabetes(return_X_y=True, as_frame=True)
X_poly = pd.concat([X, X.pow(2).add_suffix('^2')], axis=1)

# Add noise
rng = np.random.RandomState(42)
y_noisy = y + rng.normal(scale=70, size=y.shape)

# Split
X_tr, X_te, y_tr, y_te = train_test_split(X_poly, y_noisy, test_size=0.3, random_state=42)

# Linear vs XGB
lin = LinearRegression().fit(X_tr, y_tr)
xgb = XGBRegressor(n_estimators=200, learning_rate=0.05,
                   early_stopping_rounds=10, random_state=42,
                   verbosity=0).fit(X_tr, y_tr, eval_set=[(X_te, y_te)], verbose=False)

mse_lin = mean_squared_error(y_te, lin.predict(X_te))
mse_xgb = mean_squared_error(y_te, xgb.predict(X_te))

print(f"LinReg MSE = {mse_lin:.1f} | XGB MSE = {mse_xgb:.1f}")
```

**Result**: `LinReg MSE = 7311.6 | XGB MSE = 7322.6`

Both models hit around 7,300 MSE (linear regression is slightly lower); boosting cannot overcome the noise floor, while linear regression is cheaper and easier to interpret.

## Limitations & When to Go Complex

* **Non-linear interactions abound** (images, speech, graphs). Deep nets or tree ensembles thrive.
* **Huge data with rich structure** lets complex models reduce bias faster than they increase variance.
* **Representation learning** is indispensable when raw features are uninformative (e.g., pixels).

Still, *baseline linear models* remain a critical yardstick—fast to train, easy to debug, and surprisingly strong on many real-world tasks.


> *“Make everything as simple as possible, but no simpler.”* — Albert Einstein

Happy modeling!