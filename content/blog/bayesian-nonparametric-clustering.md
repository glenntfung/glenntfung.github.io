Many clustering methods ask us to choose the number of clusters before seeing the final result. That can feel artificial: why insist on five groups if the data seem to contain three—or eight? Bayesian nonparametric clustering keeps the door open. The model can use more clusters when they help and leave them unused when they do not.

Here, *nonparametric* does not mean “parameter-free.” It means that the model's capacity is not capped in advance. A finite data set still produces a finite number of occupied clusters.

The key ideas are easier to understand when introduced in sequence:

**Dirichlet process → CRP and stick-breaking → DP mixture → extensions**

The Dirichlet process is the underlying prior. The Chinese restaurant process and stick-breaking construction are two ways to look inside it: one follows how observations group together, while the other reveals the clusters' hidden weights. Adding a likelihood connects those abstract clusters to observed data. The later sections adapt the basic idea to grouped data, different cluster-size patterns, and multiple latent features.

## 1. The Dirichlet Process

A Dirichlet process is a <mark>distribution over probability distributions</mark>:

$$
G \sim \operatorname{DP}(\alpha, G_0).
$$

One way to read this notation is:

- $G_0$ is a rough sketch of where plausible cluster parameters should lie.
- $\alpha>0$ controls how closely the random distribution follows that sketch. A small $\alpha$ tends to concentrate mass on a few values; a large $\alpha$ spreads it across more values.
- $G$ is one particular distribution drawn using those two ingredients.

The useful surprise is that a draw $G$ behaves like a collection of spikes: it places positive probability on a countable set of exact values. In formal language, $G$ is almost surely discrete, even when $G_0$ is continuous. If several observations select the same spike, they share the same parameter and belong to the same cluster. That is where clustering comes from.

## 2. The Chinese Restaurant Process

The Chinese restaurant process gives a partition-based view of the Dirichlet process.

Imagine observations as customers entering a restaurant one at a time. Each customer either:

- joins an occupied table, with probability proportional to the number already seated there, or
- starts a new table, with probability proportional to $\alpha$.

For observation $i$, let $n_k$ be the number of earlier observations assigned to cluster $k$. Then

$$
P(z_i=k)=\frac{n_k}{\alpha+i-1},
$$

for an existing cluster $k$, and

$$
P(z_i=\text{new})=\frac{\alpha}{\alpha+i-1}.
$$

This captures two important effects:

1. **Rich-get-richer:** large clusters attract more observations.
2. **Open-ended growth:** new clusters can always appear.

The parameter $\alpha$ now has an intuitive role: it measures the pull of an empty table. A larger $\alpha$ makes customers more willing to start a new table and therefore tends to produce more clusters. Still, opening a new table is always only an option, not a requirement; once we add a likelihood, the observed data also influence which groupings are plausible.

> **Note:** The restaurant story unfolds one customer at a time, but the probability assigned to a final grouping does not change when we reorder the customers. This property is called exchangeability.

## 3. Stick-Breaking

Stick-breaking gives a weight-based view of the same Dirichlet process.

Start with a stick of length one. Break off a fraction $v_1$, then take a fraction $v_2$ of what remains, and continue:

$$
v_k \overset{\text{iid}}{\sim} \operatorname{Beta}(1,\alpha),
$$

$$
\pi_k=v_k\prod_{\ell<k}(1-v_\ell).
$$

The Beta distribution here simply produces a fraction between zero and one; $\alpha$ influences how large those breaks tend to be. Each piece $\pi_k$ becomes a cluster's weight. Because every new piece comes from the remaining stick, later pieces tend to become smaller, and together the pieces account for the original length of one. Pair each weight with a cluster parameter $\phi_k$ drawn from $G_0$, giving

$$
G=\sum_{k=1}^{\infty}\pi_k\delta_{\phi_k}.
$$

Here, $\delta_{\phi_k}$ simply means that the weight $\pi_k$ is placed exactly at the value $\phi_k$. This is the collection of spikes described earlier.

In the restaurant analogy, the weights $\pi_k$ are the tables' hidden popularities. Stick-breaking shows those popularities directly; the CRP shows the seating pattern they produce without displaying them. They are two views of the same Dirichlet process, not competing models.

## 4. From the DP to a Clustering Model

So far, the DP has described repeated parameter values, not the observations themselves. It becomes a clustering model when paired with a likelihood:

$$
G\sim \operatorname{DP}(\alpha,G_0),
$$

$$
\theta_i\mid G\overset{\text{iid}}{\sim}G,
$$

$$
y_i\mid\theta_i\sim p(y_i\mid\theta_i).
$$

The three lines say: draw a random menu of cluster parameters, let each observation choose one of them, and then generate the observed value around the chosen parameter. Observations at the same “table” share $\theta_i$, but the likelihood allows their observed values to differ. A cluster is therefore a family resemblance, not a set of identical points.

For example, if each cluster $k$ has parameter $\phi_k=(\mu_k,\Sigma_k)$, then a Gaussian mixture uses

$$
y_i\sim \mathcal{N}(\mu_{z_i},\Sigma_{z_i}),
$$

where $z_i$ indicates the cluster used by observation $i$. Each Gaussian cluster has its own center $\mu_k$ and spread $\Sigma_k$. The model makes room for countably many potential components, but any finite data set occupies only finitely many. Posterior inference works out which ones are useful and which observations belong together.

This construction is the **Dirichlet process mixture**: the DP supplies reusable component parameters and random weights, while the likelihood describes observations within each component.

## 5. The Hierarchical Dirichlet Process

The hierarchical Dirichlet process is designed for grouped data.

Suppose observations belong to documents, markets, schools, or time periods. Each group may use the same clusters in different proportions. For example, a collection of documents might share topics such as politics, sports, and technology, while each document emphasizes those topics differently.

The hierarchical Dirichlet process gives all groups a shared global menu of clusters, then lets each group choose its own preferences over that menu. The groups reuse the same cluster definitions rather than inventing unrelated ones. Compared with an ordinary DP mixture, the HDP adds a layer for sharing.

The corresponding partition view is called the **Chinese restaurant franchise**.

## 6. The Pitman–Yor Process

The ordinary CRP often creates a few popular tables alongside smaller ones, but in some data the imbalance is much stronger: think of word frequencies, where a handful of words are extremely common and there is a long tail of rare words.

The Pitman–Yor process adds a discount parameter $d$ that slightly weakens the pull of every occupied table and redirects some probability toward creating new ones. Using the same notation as in the CRP section, and letting $K$ be the current number of clusters, its probabilities are

$$
P(z_i=k)=\frac{n_k-\color{#dc2626}{\boldsymbol{d}}}{\alpha+i-1},
$$

for an existing cluster, and

$$
P(z_i=\text{new})=
\frac{\alpha+\color{#dc2626}{\boldsymbol{d}}K}{\alpha+i-1}.
$$

The highlighted terms are the only changes from the CRP probabilities above. The discount subtracts a little weight from each occupied table, while the $dK$ term makes a new table increasingly attractive as more tables appear.

When $d=0$, both highlighted terms disappear and the process reduces to the usual Dirichlet process. For $d>0$, it tends to produce:

- more small clusters,
- a heavier-tailed cluster-size distribution,
- faster growth in the number of clusters.

In plain terms, new clusters keep appearing more readily as the sample grows. This makes the Pitman–Yor process useful when the data contain a few very large groups and a long tail of small ones.

## 7. The Indian Buffet Process

Clustering assumes that each observation belongs to one group. Some problems instead require multiple membership: a movie can be both a comedy and a romance, and a customer can be both price-sensitive and brand-loyal.

The Indian buffet process handles this setting. Customers move through a buffet, choosing popular dishes and occasionally trying new ones. Unlike the restaurant process, each customer may select several dishes. We can record the result as a table whose rows are observations and columns are features: a 1 means that an observation has the feature, and a 0 means that it does not. The number of possible feature columns can grow as more observations arrive.

The IBP is therefore a parallel idea rather than another clustering process. The CRP asks *which one cluster?*; the IBP asks *which collection of features?*

## Putting the Pieces Together

The simplest way to keep these ideas straight is to ask what each one contributes. The **Dirichlet process** makes room for an open-ended collection of reusable cluster parameters. The **CRP** shows how observations gather around them, while **stick-breaking** shows their hidden weights. A **DP mixture** adds the bridge from those parameters to actual data. The **HDP** shares clusters across groups, the **Pitman–Yor process** allows a longer tail of small clusters, and the **IBP** replaces one-cluster membership with a collection of features.
