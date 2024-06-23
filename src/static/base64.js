const name = process.argv[2];
const count = process.argv[3] || 50;
if (name === undefined) return;
var fs = require('fs');
let arr = [];
for (i=1; i<=count; i++) {
    var imageAsBase64 = fs.readFileSync(`src/assets/images/${name}/${i}.jpg`, 'base64');
    arr.push(`data:image/jpeg;base64,${imageAsBase64}`);
}
fs.writeFileSync(`src/static/${name}.json`, JSON.stringify(arr));
console.log(console.log(process.argv));