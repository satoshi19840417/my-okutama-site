const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');
const cheerio = require('cheerio');

// Load the image dimensions
const imageDimensions = JSON.parse(fs.readFileSync('image-dimensions.json', 'utf8'));

// Find all HTML files
const htmlFiles = globSync('**/*.html', { ignore: ['node_modules/**', 'dist/**'] });

htmlFiles.forEach(htmlFile => {
    let changed = false;
    const htmlContent = fs.readFileSync(htmlFile, 'utf8');
    const $ = cheerio.load(htmlContent, { decodeEntities: false });

    $('img').each((i, el) => {
        const img = $(el);
        const src = img.attr('src');

        if (!src) {
            return;
        }

        // The src is relative to the HTML file. We need to resolve it to be relative to the project root
        // so we can look it up in our imageDimensions map.
        const htmlDir = path.dirname(htmlFile);
        let imagePath = path.normalize(path.join(htmlDir, src));

        // On Windows, path.join uses backslashes. The JSON keys use forward slashes.
        imagePath = imagePath.replace(/\\/g, '/');

        // The image dimensions are stored with the .webp extension.
        const webpPath = imagePath.replace(/\.(jpe?g|png)$/i, '.webp');

        const dimensions = imageDimensions[webpPath];

        if (dimensions) {
            const currentWidth = img.attr('width');
            const currentHeight = img.attr('height');

            if (String(currentWidth) !== String(dimensions.width) || String(currentHeight) !== String(dimensions.height)) {
                img.attr('width', dimensions.width);
                img.attr('height', dimensions.height);
                changed = true;
            }
        } else {
             console.warn(`[WARN] Dimensions not found for image: ${webpPath} in ${htmlFile} (original src: ${src})`);
        }
    });

    if (changed) {
        let outputHtml = $.html();
        if (!outputHtml.toLowerCase().startsWith('<!doctype html>')) {
            outputHtml = '<!DOCTYPE html>\n' + outputHtml;
        }
        fs.writeFileSync(htmlFile, outputHtml, 'utf8');
        console.log(`Updated image dimensions in ${htmlFile}`);
    }
});

console.log('Finished updating image dimensions.'); 