const fs = require('fs');
const cheerio = require('cheerio');
const { globSync } = require('glob');
const path = require('path');

// Find all HTML files in the project, excluding node_modules and dist
const files = globSync('**/*.html', { ignore: ['node_modules/**', 'dist/**'] });

files.forEach(file => {
  const html = fs.readFileSync(file, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });
  let changesMade = false;

  $('img').each(function () {
    const img = $(this);
    const parent = img.parent();

    // Skip if it's already in a <picture> element
    if (parent.is('picture')) {
      return;
    }

    const src = img.attr('src');
    if (src && (src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png'))) {
      const webpSrc = src.replace(/\.(jpe?g|png)$/, '.webp');
      
      const picture = $('<picture></picture>');
      picture.append(`<source srcset="${webpSrc}" type="image/webp">`);
      
      // Add the original image tag inside the picture tag
      picture.append(img.clone());
      
      img.replaceWith(picture);
      changesMade = true;
    }
  });

  if (changesMade) {
    // Cheerio can sometimes mess up the DOCTYPE, so let's ensure it's correct.
    let outputHtml = $.html();
    if (!outputHtml.toLowerCase().startsWith('<!doctype html>')) {
        outputHtml = '<!DOCTYPE html>\\n' + outputHtml;
    }

    fs.writeFileSync(file, outputHtml, 'utf8');
    console.log(`Updated images in ${file} to use <picture> tag.`);
  }
}); 