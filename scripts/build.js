const fs = require('fs')
const pug = require('pug')
const sass = require('sass')
const cp = require('child_process')
const os = require('os')
const path = require('path')

let buildDir
const prefix = 'dnd-sheet-kobo-'

try {
    buildDir = fs.mkdtempSync(path.join(os.tmpdir(), prefix))
    const includeDir = path.join(buildDir, 'includes')
    fs.mkdirSync(includeDir)

    for(const file of fs.readdirSync('src/includes')) {
        fs.copyFileSync(`src/includes/${file}`, path.join(includeDir, file))
    }

    console.log('Building TypeScript')
    cp.spawnSync('tsc', [
        '-p', 'tsconfig.json',
        '--outdir', includeDir
    ], {
        shell: true
    })

    console.log('Building SCSS')
    const css = sass.compile('src/style.scss').css
    fs.writeFileSync(path.join(includeDir, 'style.css'), css)

    console.log('Building Pug')
    
    fs.copyFileSync('src/Index.pug', path.join(buildDir, 'Index.pug'))
    let compiledSheet = pug.renderFile(path.join(buildDir, 'Index.pug'))
    if(!fs.existsSync('dist')) {
        fs.mkdirSync('dist')
    }

    const sheets = require('./../sheets.json')
    for(const sheetName in sheets) {
        console.log('Creating Sheet: %s', sheetName)
        compiledSheet = compiledSheet.replace('!{sheetUrl}', sheets[sheetName])
        fs.writeFileSync(path.join('dist', `DnD Sheet - ${sheetName}.html`), compiledSheet)
    }
} catch(ex) {
    console.error(ex)
} finally {
    if(buildDir) {
        fs.rmSync(buildDir, { recursive: true })
    }
    console.log('Done')
}