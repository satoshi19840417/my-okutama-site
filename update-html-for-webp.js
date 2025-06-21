const cheerio = require('cheerio');
const glob = require('glob');
const fs = require('fs');
const path = require('path');

const htmlFiles = glob.sync('**/*.html', { ignore: 'node_modules/**' });

if (htmlFiles.length === 0) {
    console.log("No HTML files found.");
    process.exit(0);
}

htmlFiles.forEach(file => {
    const html = fs.readFileSync(file, 'utf-8');
    const $ = cheerio.load(html, { decodeEntities: false });
    let changesMade = false;

    $('img').each(function() {
        const img = $(this);
        const src = img.attr('src');

        if (!src || src.startsWith('data:')) {
            return;
        }

        // Add lazy loading attributes
        if (img.attr('loading') !== 'lazy') {
            img.attr('loading', 'lazy');
            changesMade = true;
        }
        if (img.attr('decoding') !== 'async') {
            img.attr('decoding', 'async');
            changesMade = true;
        }

        // Handle WebP conversion
        const ext = path.extname(src);
        if (['.jpg', '.jpeg', '.png'].includes(ext.toLowerCase())) {
            const webpSrc = src.replace(ext, '.webp');
            const webpPath = path.join(path.dirname(file), webpSrc);
            
            if (fs.existsSync(webpPath)) {
                // Avoid re-wrapping if already in a picture element
                if (img.parent().is('picture')) {
                    return;
                }

                const picture = $('<picture></picture>');
                const source = $('<source>').attr({
                    srcset: webpSrc,
                    type: 'image/webp'
                });
                picture.append(source);
                img.clone().appendTo(picture);
                img.replaceWith(picture);
                changesMade = true;
            }
        }
    });

    if (changesMade) {
        fs.writeFileSync(file, $.html(), 'utf-8');
        console.log(`Updated ${file}`);
    } else {
        console.log(`No changes needed for ${file}`);
    }
});

console.log("HTML update process complete."); 