const fs = require('fs')
const cp = require("child_process")

const filesToWatch = [
    'scripts/build.js',
    'src/main.ts',
    'src/style.scss',
    'src/index.pug',
    'sheets.json'
]

for(const file of filesToWatch) {
    fs.watchFile(file, { persistent: true, interval: 1000 }, (cur, prev) => {
        console.log(`'${file}' changed`)
        cp.fork('scripts/build.js', ['watch'])
    })
}