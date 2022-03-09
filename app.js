/* 此文件用于导出需要做国际化翻译的语句 */
const fs = require('fs');
const xlsx = require('node-xlsx').default

/**
 *
 * @param {Array} jsonData
 * @returns
 */
function flatObject(jsonData) {
    let stack = []
    const retObj = {}
    function flat(obj, index) {
        if (typeof obj === 'string') {
            const flatKey = stack.join('.')
            const value = retObj[flatKey]
            if (!value) {
                retObj[flatKey] = []
            }
            retObj[flatKey].push({index: index, value: obj})
            return obj;
        }
        const keys = Object.keys(obj);
        keys.forEach(key => {
            stack.push(key);
            flat(obj[key], index)
            stack.pop();
        })
    }

    jsonData.forEach((item, index) => {
        flat(item, index + 1)
    });

    return retObj;
}

/**
 * 将对象变成数组
 * @param {*} data
 * @param {*} length
 * @returns
 */
function handleData(data, length) {
    const retAry = []
    for ([key, value] of Object.entries(data)) {
        const tempAry = [key]
        for (let i = 1; i <= length; i++) {
            if (value.length && value[0].index === i) {
                tempAry[i] = value.shift().value;
            } else {
                tempAry[i] = null
            }
        }
        retAry.push(tempAry)
    }
    return retAry;
}

function readFile() {
    const ary = [];
    ary.push(require('./zh.json'))
    ary.push(require('./en.json'))
    ary.push(require('./th.json'))
    return ary;
}

function write(fileName, sheetName) {
    const files = readFile();
    const data = flatObject(files, files.length);
    const handledData = handleData(data, 3)
    fs.writeFileSync('./test.json', JSON.stringify(handledData))
    const buffer = xlsx.build(
        [
            {
                name: sheetName,
                data: handledData
            }
        ]
    )

    fs.writeFileSync(`./${fileName}.xlsx`, buffer)
}

write('translate')
