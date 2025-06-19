# Gemfile

source "https://rubygems.org/"

############################################################
# Core engine                                              
############################################################
gem "jekyll", "~> 4.3"         # match what you run locally & what GH Pages supports
gem "jemoji"
gem "rouge"

############################################################
# Theme (Minima 2.5+)                                      
############################################################
gem "minima", "~> 2.5"

############################################################
# Plugins (only the ones you actually use)                 
############################################################
group :jekyll_plugins do
  gem "jekyll-sitemap"
  gem "jekyll-feed"
  gem "jekyll-paginate-v2"
  gem "jekyll-katex"
  gem "jekyll-scholar"
  gem "jekyll-archives"
  gem "jekyll-toc"
end

############################################################
# Windows helpers (ignored elsewhere)                       
############################################################
install_if -> { Gem.win_platform? } do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
  gem "wdm", "~> 0.1.1"
end
