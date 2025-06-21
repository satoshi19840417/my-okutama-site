const sharp = require('sharp');
const { globSync } = require('glob');
const fs = require('fs');
const path = require('path');

const imageDirs = ['images', '活動紹介'];
let patterns = imageDirs.map(dir => path.join(dir, '**', '*.{jpg,jpeg,png}'));
const dimensions = {};

// On Windows, glob needs forward slashes
if (path.sep === '\\') {
    patterns = patterns.map(p => p.replace(/\\/g, '/'));
}

console.log('Searching for images in:', patterns);

let processedCount = 0;
let totalFiles = 0;

const allFiles = patterns.flatMap(pattern => globSync(pattern));
totalFiles = allFiles.length;

if (totalFiles === 0) {
    writeDimensionsFile();
}

allFiles.forEach(file => {
    const outputFilename = file.substring(0, file.lastIndexOf('.')) + '.webp';
    
    sharp(file)
        .resize({ width: 1200, withoutEnlargement: true })
        .toFile(outputFilename)
        .then(info => {
            console.log(`Successfully converted ${file} to ${outputFilename}`);
            // Windows path normalization
            const normalizedPath = outputFilename.replace(/\\/g, '/');
            dimensions[normalizedPath] = { width: info.width, height: info.height };
        })
        .catch(err => {
            console.error(`Error converting ${file} to webp:`, err);
        })
        .finally(() => {
            processedCount++;
            if (processedCount === totalFiles) {
                writeDimensionsFile();
            }
        });
});

function writeDimensionsFile() {
    fs.writeFileSync('image-dimensions.json', JSON.stringify(dimensions, null, 2));
    console.log('Successfully wrote image dimensions to image-dimensions.json');
} 