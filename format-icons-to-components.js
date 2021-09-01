const fs = require('fs')
const dir = './src/icons'
const componentsDir = './src/components'

const files = fs.readdirSync(dir)
if (files && !fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir)
}

files.forEach((file) => {
    fs.readFile(`${dir}/${file}`, 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        const fileName = createComponentFileName(file)
        console.log('Creating -', fileName)
        const template = createTemplate(fileName, convertContent(data))

        console.log('---------------------------')

        fs.writeFile(`${componentsDir}/${fileName}`, template, function (err) {
            if (err) throw err
        })
        const fileExport = `export { default as ${fileName.replace('.vue', '')} } from './components/${fileName.replace('.vue', '')}'
`
        fs.appendFile('./src/index.js', fileExport, function (err) {
            if (err) throw err
        })
    })
})

function convertContent (data) {
    const svgIndex = data.indexOf('<svg ') + 5 // 5 is '<svg ' length
    let result = data.slice(0, svgIndex) + 'class="fill-current" ' + data.slice(svgIndex)

    let fillIndex = result.indexOf('fill=', 0) // in svg icons first 'fill=' is for svg tag and we don't need to remove it
    while ((fillIndex = result.indexOf('fill=', fillIndex + 1)) !== -1) {
        result = result.slice(0, fillIndex) + result.slice(fillIndex + 7 + result.slice(fillIndex + 6).indexOf('"')) // 6 and 7 is 'fill=' length without and with extra space
    }

    return result
}

function createTemplate (fileName, svgContent) {
    return `<template>
${svgContent}
</template>

<script>

export default {
  name: '${fileName.replace('.vue', '')}',
}
</script>
`
}

function createComponentFileName (file) {
    return `Icon${file.replace('.svg', '.vue').replace(/\s/g, '').replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '')}`
}
