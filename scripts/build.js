const fs = require('fs')
const pug = require('pug')
const sass = require('sass')
const cp = require("child_process")
const sheets = require('./../sheets.json')

const fromWatch = process.argv.length > 1 && process.argv[2] == 'watch'
function removeDirIfExists(path) {
    if(fs.existsSync(path)) {
        fs.rmSync(path, {
            recursive: true
        })
    }
}

function recreateDir(path) {
    removeDirIfExists(path)
    fs.mkdirSync(path, {
        recursive: true
    })
}

if(!fromWatch) {
    recreateDir('dist')
} else {
    if(!fs.existsSync('dist')) {
        fs.mkdirSync('dist')
    }
}
recreateDir('build/includes')

console.log('Building TypeScript')
cp.execSync('tsc -p src/tsconfig.json')
fs.copyFileSync('src/includes/main.js', 'build/includes/main.js')
fs.copyFileSync('src/includes/jquery.js', 'build/includes/jquery.js')

console.log('Building SCSS')
fs.writeFileSync('build/includes/style.css', sass.compile('src/style.scss').css)

console.log('Building Pug')
for(const file of fs.readdirSync('src/includes')) {
    if(file.endsWith('.pug')) {
        fs.copyFileSync(`src/includes/${file}`, `build/includes/${file}`)
    }
}

fs.copyFileSync('src/Index.pug', 'build/Index.pug')
let compiledSheet = pug.renderFile('build/Index.pug')

for(const sheetName in sheets) {
    const path = sheets[sheetName]
    compiledSheet = compiledSheet.replace('!{sheetUrl}', path)
    fs.writeFileSync(`dist/DnD Sheet - ${sheetName}.html`, compiledSheet)
}

removeDirIfExists('build')