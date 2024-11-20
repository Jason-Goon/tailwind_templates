const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');
const distDir = path.join(__dirname, 'dist');
const sitemapStream = new SitemapStream({ hostname: 'https://magenta.red/' });
const writeStream = fs.createWriteStream(path.join(distDir, 'sitemap.xml.gz'));

sitemapStream.pipe(createGzip()).pipe(writeStream);

const addUrlsFromDirectory = (dir) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      addUrlsFromDirectory(filePath);
    } else if (file.endsWith('.html')) {
      const relativePath = path.relative(distDir, filePath).replace(/\\/g, '/');
      sitemapStream.write({
        url: `/${relativePath}`,
        changefreq: 'monthly',
        priority: 0.8,
      });
    }
  });
};

addUrlsFromDirectory(distDir);

sitemapStream.end();

streamToPromise(sitemapStream)
  .then(() => {
    console.log('Sitemap created successfully!');
  })
  .catch((err) => {
    console.error('Error creating sitemap:', err);
  });
