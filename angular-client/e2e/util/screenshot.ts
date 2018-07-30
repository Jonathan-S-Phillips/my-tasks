import * as fs from 'fs';

/**
 * Writes the given screenshot data to the given filename.
 * 
 * @param data The data for the screenshot.
 * @param filename The filename for the screenshot.
 */
export function writeScreenshot(data, filename) {
    var stream = fs.createWriteStream(`target/screenshots/${filename}`);
    stream.write(new Buffer(data, 'base64'));
    stream.end();
}
