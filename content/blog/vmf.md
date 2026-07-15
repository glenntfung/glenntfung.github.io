Directional data arise whenever orientation matters more than magnitude. A wind direction, a point on the globe, and a normalized embedding are all unit vectors: their lengths have been fixed, so the information lies in where they point. This is especially useful in high dimensions—for example, with normalized LLM embeddings—where magnitude may be sensitive to scale or preprocessing, while direction can capture semantic similarity.

The von Mises–Fisher distribution, usually abbreviated vMF, is a natural model for such data. It plays a role on the sphere similar to that of an isotropic Gaussian in Euclidean space: one parameter specifies the preferred direction, and another controls how tightly observations gather around it.

This post develops the density, its normalization constant, the relevant Bessel-function asymptotics, and a numerically stable way to evaluate the log density.

## 1. Geometry and Density

Let

$$
\mathbb{S}^{p-1}
=
\left\{\mathbf{x}\in\mathbb{R}^p:\lVert\mathbf{x}\rVert=1\right\}
$$

be the unit sphere in $p$-dimensional Euclidean space. The sphere itself has dimension $p-1$: for example, $\mathbb{S}^1$ is the unit circle and $\mathbb{S}^2$ is the familiar sphere in three-dimensional space.

For $\mathbf{x}\in\mathbb{S}^{p-1}$, the vMF density with mean direction $\boldsymbol{\mu}\in\mathbb{S}^{p-1}$ and concentration $\kappa\geq 0$ is

$$
f(\mathbf{x}\mid\boldsymbol{\mu},\kappa)
=
C_p(\kappa)\exp\!\left(\kappa\boldsymbol{\mu}^{\top}\mathbf{x}\right).
$$

Because both vectors have unit length,

$$
\boldsymbol{\mu}^{\top}\mathbf{x}=\cos\theta,
$$

where $\theta$ is the angle between them. The density is therefore proportional to $\exp(\kappa\cos\theta)$. This gives the two parameters a direct geometric interpretation:

- $\boldsymbol{\mu}$ points toward the mode of the distribution.
- $\kappa$ controls angular concentration. At $\kappa=0$, every direction is equally likely; as $\kappa$ grows, the density becomes more concentrated around $\boldsymbol{\mu}$.

For $\kappa>0$, the normalization constant is

$$
C_p(\kappa)
=
\frac{\kappa^{p/2-1}}
{(2\pi)^{p/2}I_{p/2-1}(\kappa)},
$$

where $I_\nu$ is the modified Bessel function of the first kind of order $\nu$. At $\kappa=0$, $C_p(0)$ is defined by its continuous limit, derived in the small-concentration section below. This constant is the technically difficult part of the density: it makes the density integrate to one, but it also requires care when $\kappa$ is very small or very large.

## 2. Why the Bessel Function Matters

Let

$$
\nu=\frac{p}{2}-1.
$$

The modified Bessel function of the first kind has the series expansion

$$
I_\nu(\kappa)
=
\sum_{m=0}^{\infty}
\frac{1}{m!\,\Gamma(m+\nu+1)}
\left(\frac{\kappa}{2}\right)^{2m+\nu}.
$$

The Bessel function appears because normalizing the vMF density requires integrating an exponential of cosine similarity over an entire sphere. For computation, the important point is not the full series itself but how it behaves at the two extremes of $\kappa$.

### Small Concentration: $\kappa\to 0$

When $\kappa$ is small, the first term of the series dominates:

$$
I_\nu(\kappa)
\sim
\frac{1}{\Gamma(\nu+1)}
\left(\frac{\kappa}{2}\right)^\nu
=
\frac{\kappa^\nu}{2^\nu\Gamma(p/2)}.
$$

Substituting this approximation into the normalization constant gives

$$
C_p(\kappa)
\longrightarrow
\frac{\Gamma(p/2)}{2\pi^{p/2}}
=
\frac{1}{S_{p-1}},
$$

where

$$
S_{p-1}=\frac{2\pi^{p/2}}{\Gamma(p/2)}
$$

is the surface area of $\mathbb{S}^{p-1}$. Since $\exp(\kappa\boldsymbol{\mu}^{\top}\mathbf{x})\to 1$ as well,

$$
f(\mathbf{x}\mid\boldsymbol{\mu},\kappa)
\longrightarrow
\frac{1}{S_{p-1}}.
$$

Thus, the vMF distribution converges to the uniform distribution on the sphere. Intuitively, when $\kappa$ vanishes, the model loses its preferred direction.

### Large Concentration: $\kappa\to\infty$

For fixed $\nu$ and large $\kappa$,

$$
I_\nu(\kappa)
\sim
\frac{e^\kappa}{\sqrt{2\pi\kappa}}
\left(
1-\frac{4\nu^2-1}{8\kappa}
+O(\kappa^{-2})
\right).
$$

This exponential growth explains why direct numerical evaluation can overflow. It also reveals the local shape of the vMF density. Near the mean direction, $\theta$ is small, so

$$
\cos\theta\approx 1-\frac{\theta^2}{2}
\qquad\Longrightarrow\qquad
e^{\kappa\cos\theta}
\approx
e^\kappa e^{-\kappa\theta^2/2}.
$$

Locally, the angular deviation therefore looks Gaussian, with a typical scale of order $\kappa^{-1/2}$. Large $\kappa$ means a narrow cap around $\boldsymbol{\mu}$.

Scientific libraries commonly avoid the overflow in $I_\nu(\kappa)$ by evaluating the scaled Bessel function

$$
I_\nu^{\mathrm{sc}}(\kappa)
=
e^{-\kappa}I_\nu(\kappa),
$$

which remains representable even when $I_\nu(\kappa)$ itself is enormous. Its large-$\kappa$ behavior is

$$
I_\nu^{\mathrm{sc}}(\kappa)
\sim
\frac{1}{\sqrt{2\pi\kappa}}
\left(
1-\frac{4\nu^2-1}{8\kappa}
+O(\kappa^{-2})
\right).
$$

## 3. The Log-Normalization Constant

Probability calculations are usually performed in log space. With $\nu=p/2-1$,

$$
\log C_p(\kappa)
=
\nu\log\kappa
-\frac{p}{2}\log(2\pi)
-\log I_\nu(\kappa).
$$

For large $\kappa$, use

$$
\log I_\nu(\kappa)
=
\kappa+\log I_\nu^{\mathrm{sc}}(\kappa)
$$

to obtain the stable expression

$$
\log C_p(\kappa)
=
\nu\log\kappa
-\frac{p}{2}\log(2\pi)
-\kappa
-\log I_\nu^{\mathrm{sc}}(\kappa).
$$

At very small $\kappa$, the terms $\nu\log\kappa$ and $\log I_\nu(\kappa)$ both become problematic even though their difference has a finite limit. In that regime, use

$$
\log C_p(0)
=
\log\Gamma(p/2)-\log 2-\frac{p}{2}\log\pi,
$$

or a small-$\kappa$ expansion around it. The two regimes address different numerical failures: the small-$\kappa$ formula avoids cancellation and undefined logarithms, while the scaled Bessel function prevents overflow at large $\kappa$.

## 4. Deriving the Normalization Constant

It remains to show why the stated $C_p(\kappa)$ is correct. Define the unnormalized integral

$$
Z_p(\kappa)
=
\int_{\mathbb{S}^{p-1}}
\exp\!\left(\kappa\boldsymbol{\mu}^{\top}\mathbf{x}\right)
\,\mathrm{d}\sigma(\mathbf{x}).
$$

Rotational symmetry allows us to align $\boldsymbol{\mu}$ with the first coordinate axis. Writing $x_1=\cos\theta$, the remaining coordinates form a copy of $\mathbb{S}^{p-2}$, and the surface element contributes $\sin^{p-2}\theta$. Hence

$$
Z_p(\kappa)
=
S_{p-2}
\int_0^\pi
e^{\kappa\cos\theta}
\sin^{p-2}\theta
\,\mathrm{d}\theta,
$$

where

$$
S_{p-2}
=
\frac{2\pi^{(p-1)/2}}
{\Gamma((p-1)/2)}.
$$

The modified Bessel function has the integral representation

$$
I_\nu(z)
=
\frac{(z/2)^\nu}
{\sqrt{\pi}\,\Gamma(\nu+1/2)}
\int_0^\pi
e^{z\cos\theta}
\sin^{2\nu}\theta
\,\mathrm{d}\theta.
$$

Set $\nu=p/2-1$, so that $2\nu=p-2$. Rearranging the integral representation and substituting the sphere area gives

$$
\begin{aligned}
Z_p(\kappa)
&=
S_{p-2}\sqrt{\pi}\,
\Gamma\!\left(\frac{p-1}{2}\right)
\left(\frac{2}{\kappa}\right)^{p/2-1}
I_{p/2-1}(\kappa)\\
&=
(2\pi)^{p/2}
\kappa^{1-p/2}
I_{p/2-1}(\kappa).
\end{aligned}
$$

Therefore

$$
C_p(\kappa)
=
Z_p(\kappa)^{-1}
=
\frac{\kappa^{p/2-1}}
{(2\pi)^{p/2}I_{p/2-1}(\kappa)},
$$

which is the required normalization constant.

## 5. The Main Picture

The vMF distribution is built from a simple geometric score, $\boldsymbol{\mu}^{\top}\mathbf{x}=\cos\theta$, and a nontrivial normalization constant. The geometry explains the model: $\boldsymbol{\mu}$ chooses a direction and $\kappa$ controls angular spread. The Bessel function supplies the exact normalization, its asymptotics recover the uniform and highly concentrated limits, and its scaled form makes the density practical to evaluate numerically.
