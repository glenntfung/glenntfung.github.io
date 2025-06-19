Files needed to replicate Gregory Gunderson's blog, [gregorygundersen.com/blog](http://gregorygundersen.com/blog/). For details, see [this post](http://gregorygundersen.com/blog/2020/06/21/blog-theme).

To use docker, run 

```
bundle install
docker build -t my-jekyll-site .
docker run --rm -it -v "$PWD:/srv/jekyll" -p 4000:4000 my-jekyll-site
```

To erase mega data from images, use ExifTool:

```
exiftool -all= -overwrite_original *.jpg *.jpeg *.png
```

To convert `.pdf` files to `.png`, use ImageMagick:

```
for file in *.pdf; do 
  echo "Processing $file..."
  magick -density 600 "$file" -quality 100 "${file%.pdf}.png"
done
```