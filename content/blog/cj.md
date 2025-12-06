## Introduction

Comparative judgment involves using pairwise comparisons to access the abilities of the compared objects. This is widely applied in the real world, e.g., sports science, psychology, and education. For example, many sport games (e.g., basketball, football, chess) involve two players/teams competing against each other each time. The resulting data can be used in comparative judgment.

## Bradley–Terry Model

The Bradley–Terry model (Bradley & Terry, 1952) is commonly applied in comparative judgment. It assumes a set $\mathcal{P}=\left\{1,\dots,p\right\}$ in which every component is a "player" compared with another by some judges, with $\alpha_i/\alpha_j$ being the probability of $i$ beating $j$. In functional form, the model seeks to estimate

$$
\text{Logit}(\pi_{ij}) = \lambda_i-\lambda_j,
$$

where $\lambda_i=\log\left(\alpha_i\right)$, $\alpha_i$ and $\lambda_i$ are the ability score and log ability score of player $i$ in $\mathcal{P}$ respectively and $\pi_{ij}$ is the probability of $i$ beats $j$. However, in this context, none of the above variables are known in practice. By the nature of logistic regression, the total number of times that $i$ beats $j$, $Y_{ij}$, is assumed to follow the binomial distribution:

$$
Y_{ij}\sim\text{Binomial}\left(n_{ij},\pi_{ij}\right),
$$

where $n_{ij}=n_{ji}$ is the number of times that $i$ and $j$ are compared against each other. This unstructured model could be further extended to a structured version, in which

$$ 
\lambda_i=\sum^p_{q=1}\beta_qx_{iq}+\varepsilon_i, 
$$

where $x_q$'s are explanatory variables and $\varepsilon_i\sim\mathcal{N}\left(0,\sigma^2\right)$ is the random error term. Both fixed and random effects could be used for estimation. The explanatory variables could be attributed to the players being compared (player-specific), to the judge (contest-specific), or to the specific comparison (contest-specific).

## Bayesian Spatial Bradley–Terry Model

The Bayesian Spatial Bradley–Terry model is specific to spatial data, allowing the learning of abilities from nearby players via clustering (Rowland et al., 2022). This model is useful for assessing issues related to human right abuses, such as forced marriage, female genital mutilation, human trafficking, and online child sexual exploitation and abuse.

## Model fitting

- The `BradleyTerry2` package in `R` for the Bradley–Terry model: [https://github.com/hturner/BradleyTerry2](https://github.com/hturner/BradleyTerry2) (Firth, 2012).
- The `BSBT` package in `R` for the Bayesian Spatial Bradley–Terry model: [https://github.com/rowlandseymour/BSBT](https://github.com/rowlandseymour/BSBT).

## References

Bradley, R. A., & Terry, M. E. (1952). Rank analysis of incomplete block designs: I. The method of paired comparisons. _Biometrika_, _39_(3/4), 324–345.

Firth, D. (2012). BradleyTerry2: Flexible models for paired comparisons in R. _Journal of Statistical Software_, _48_(9), 1–21.

Rowland, S., & others. (2022). A Bayesian spatial Bradley–Terry model for paired comparison data. _arXiv preprint_.