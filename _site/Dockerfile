FROM jekyll/jekyll:latest

# Force Ruby platform gems (helps on Apple Silicon)
ENV BUNDLE_FORCE_RUBY_PLATFORM=true \
    BUNDLE_JOBS=4 \
    BUNDLE_RETRY=3

WORKDIR /srv/jekyll

# 1. Copy Gemfile first so we cache the bundle-install layer
COPY Gemfile Gemfile.lock* ./
RUN bundle install

# 2. Copy in the rest of your site
COPY . .

# 3. Expose Jekyll’s default port
EXPOSE 4000

# 4. Serve with live reload, listening on all interfaces
CMD ["bundle", "exec", "jekyll", "serve", "--livereload", "--host=0.0.0.0"]
