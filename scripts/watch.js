const fs = require('fs')
const cp = require('child_process')
const path = require('path')

const filesToWatch = [
    'scripts/build.js',
    'src/main.ts',
    'src/style.scss',
    'src/index.pug',
    'sheets.json'
]

const includes = 'src/includes'
for(const file of fs.readdirSync(includes)) {
    filesToWatch.push(path.join(includes, file))
}

for(const file of filesToWatch) {
    fs.watchFile(file, { persistent: true, interval: 1000 }, (cur, prev) => {
        console.log('%s changed', file)
        cp.fork('scripts/build.js')
    })
}