const sharp = require('sharp');
const glob = require('glob');
const fs = require('fs');
const path = require('path');

const imageDirectories = ['images', '活動紹介'];
let patterns = [];

imageDirectories.forEach(dir => {
    if (fs.existsSync(dir)) {
        patterns.push(`${dir}/**/*.{jpg,jpeg,png}`);
    }
});

if (patterns.length === 0) {
    console.log("No image directories ('images', '活動紹介') found. Exiting.");
    process.exit(0);
}

const files = patterns.reduce((acc, pattern) => acc.concat(glob.sync(pattern)), []);

if (files.length === 0) {
    console.log("No images found to convert.");
    process.exit(0);
}

Promise.all(files.map(file => {
    const outputWebP = path.join(path.dirname(file), path.basename(file, path.extname(file)) + '.webp');
    
    return sharp(file)
        .webp({ quality: 80 })
        .toFile(outputWebP)
        .then(() => console.log(`Converted ${file} to ${outputWebP}`))
        .catch(err => console.error(`Error converting ${file}:`, err));
}))
.then(() => console.log("Image conversion complete."))
.catch(err => console.error("An error occurred during image conversion:", err)); 