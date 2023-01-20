const fs = require('fs')
const cp = require("child_process")

const filesToWatch = [
    'src/main.ts',
    'src/style.scss',
    'src/index.pug',
    'src/includes/maps.pug',
    'src/includes/mixins.pug'
]

for(const file of filesToWatch) {
    fs.watchFile(file, { persistent: true, interval: 1000 }, (cur, prev) => {
        console.log(`'${file}' changed`)
        cp.fork('scripts/build.js', ['watch'])
    })
}