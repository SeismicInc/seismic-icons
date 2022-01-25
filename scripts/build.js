const { compile: compileVue } = require('@vue/compiler-dom')
const fs = require('fs')

const dir = './src/icons'
const distDir = './dist'

fs.rmdirSync(distDir, {
    recursive: true,
})

const files = fs.readdirSync(dir)
if (files && !fs.existsSync(distDir)) {
    fs.mkdirSync(distDir)
}

files.forEach((file) => {
    fs.readFile(`${dir}/${file}`, 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        const fileName = createComponentFileName(file)
        console.log('Creating -', fileName)
        const componentSource = svgToVue(data)

        fs.writeFile(`${distDir}/${fileName}`, componentSource, function (err) {
            if (err) throw err
        })

        const componentName = fileName.replace('.js', '')
        fs.writeFile(
          `${distDir}/${fileName.replace('.js', '.d.ts')}`,
          `import { RenderFunction } from 'vue';\ndeclare const ${componentName}: RenderFunction;\nexport default ${componentName};\n`,
          function (err) { if (err) throw err}
        )


        const fileExport = `export { default as ${componentName} } from './${fileName}'\n`
        fs.appendFile('./dist/index.js', fileExport, function (err) {
            if (err) throw err
        })

        const fileExportDeclaration = `export { default as ${componentName} } from './${componentName}'\n`
        fs.appendFile('./dist/index.d.ts', fileExportDeclaration, function (err) {
            if (err) throw err
        })
    })
})

function svgToVue (svg) {
    let { code } = compileVue(cleanupSvg(svg), {
        mode: 'module',
    })

    return code.replace('export function', 'export default function')
}

function cleanupSvg (data) {
    const svgIndex = data.indexOf('<svg ') + 5 // 5 is '<svg ' length
    let result = data.slice(0, svgIndex) + 'class="fill-current" ' + data.slice(svgIndex)

    let fillIndex = result.indexOf('fill=', 0) // in svg icons first 'fill=' is for svg tag and we don't need to remove it
    while ((fillIndex = result.indexOf('fill=', fillIndex + 1)) !== -1) {
        result = result.slice(0, fillIndex) + result.slice(fillIndex + 7 + result.slice(fillIndex + 6).indexOf('"')) // 6 and 7 is 'fill=' length without and with extra space
    }

    return result
}

function createComponentFileName (file) {
    return `Icon${file.replace('.svg', '.js').replace(/\s/g, '').replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '')}`
}
