const fs = require('fs')
const pug = require('pug')
const sass = require('sass')

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

recreateDir('dist')
recreateDir('build/includes')

fs.writeFileSync('build/style.css', sass.compile('src/style.scss').css)
fs.copyFileSync('src/includes/main.js', 'build/includes/main.js')
for(const file of fs.readdirSync('src/includes')) {
    if(file.endsWith('.pug')) {
        fs.copyFileSync(`src/includes/${file}`, `build/includes/${file}`)
    }
}
fs.copyFileSync('src/Index.pug', 'build/Index.pug')
fs.writeFileSync('dist/Index.html', pug.renderFile('src/Index.pug'))

removeDirIfExists('build')