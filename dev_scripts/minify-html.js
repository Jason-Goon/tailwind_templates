const fs = require('fs');
const path = require('path');
const htmlMinifier = require('html-minifier-terser');

const minifyHtmlFiles = async (dir) => {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);

        if (fs.statSync(filePath).isDirectory()) {
            await minifyHtmlFiles(filePath); 
        } else if (path.extname(file) === '.html') {
            const originalHtml = fs.readFileSync(filePath, 'utf8');
            try {
                const minifiedHtml = await htmlMinifier.minify(originalHtml, {
                    collapseWhitespace: true,
                    removeComments: true,
                    minifyCSS: true,
                    minifyJS: true,
                });

                fs.writeFileSync(filePath, minifiedHtml, 'utf8');
                console.log(`Minified ${filePath}`);
            } catch (error) {
                console.error(`Error minifying ${filePath}:`, error);
            }
        }
    }
};

minifyHtmlFiles('dist');
