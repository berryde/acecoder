import fs from 'fs';
/**
 * Writes the contents of the template.html file as a string to template.js
 */
const path = 'src/components/preview/template/';
const html = fs.readFileSync(path + 'template.html', 'utf-8');
fs.writeFileSync(path + 'template.js', `export default ${JSON.stringify(html)};`);
