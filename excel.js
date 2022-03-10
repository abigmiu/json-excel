const xlsx = require('node-xlsx').default
const fs = require('fs')

function read(path, sheetName) {
    const workSheetsFromFile = xlsx.parse(path)
    for (let i = 0; i < workSheetsFromFile.length; i++) {
        if (workSheetsFromFile[i].name === sheetName) {
            return workSheetsFromFile[i].data
        }
    }
}

/**
 * 变成对象形式
 */
function spreedAry(data) {
    const newObj = {}
    for (const [ key, value ] of Object.entries(data)) {
        const keyItems = key.split('.')
        let temp = newObj
        for (let i = 0; i < keyItems.length - 1; i++) {
            const singleKey = keyItems[i]
            if (!temp[singleKey]) {
                temp[singleKey] = {}
            }
            temp = temp[singleKey]
        }
        const lastKey = keyItems[keyItems.length - 1]
        temp[lastKey] = value
    }
    return newObj
}

function main(params) {
    const sheetData = read(params.path, params.sheetName)
    const length = params.jsonNames.length

    const jsonAry = new Array(length).fill(null);
    jsonAry.forEach((_, index) => jsonAry[index] = {})
    for (let i = 0; i < sheetData.length; i++) {
        const key = sheetData[i][0]
        if (!key) continue
        const value = sheetData[i].slice(1)
        value.forEach((item, index) => {
            jsonAry[index][key] = item;
        })
    }

    const spreedData = jsonAry.map((item) => spreedAry(item))
    params.jsonNames.forEach((name, index) => {
        fs.writeFileSync(`./dist/${name}.json`, JSON.stringify(spreedData[index]))
    })
}
main(
    {
        path: 'pc.xlsx',
        sheetName: 'pc',
        jsonNames: ['zh', 'en', 'th']
    }
);
