/** @format */

const parcelCSS = require('@parcel/css')
const readFileSync = require('fs').readFileSync
const dirname = require('path').dirname

console.log('三样', parcelCSS, readFileSync, dirname)

function winPath(path) {
    const isExtendedLengthPath = /^\\\\\?\\/.test(path)
    if (isExtendedLengthPath) {
        return path
    }
    return path.replace(/\\/g, '/')
}

function ensureLastSlash(path) {
    return path.endsWith('/') ? path : path + '/'
}

function hashString(str) {
    let hash = Buffer.from(str).toString('base64').replace(/=/g, '')
    hash = hash.substring(hash.length - 5)
    return hash
}

function getClassNames(code, filename) {
    // why use Parcel CSS?
    // ref: https://github.com/indooorsman/esbuild-css-modules-plugin
    const {exports} = parcelCSS.transform({
        filename,
        code,
        minify: false,
        sourceMap: false,
        cssModules: {
            pattern: `[local]`,
            dashedIdents: false,
        },
    })
    return Object.keys(exports || {})
}

module.exports.cssLoader = () => {
    return {
        name: 'css-loader',
        setup(build) {
            build.onLoad({filter: /\.css$/}, args => {
                const code = readFileSync(args.path)
                const filename = winPath(args.path)
                const cssModuleObject = getClassNames(code, filename)
                    .sort()
                    .reduce((memo, key) => {
                        memo[key] = `${key}___${hashString(`${filename}@${key}`)}`
                        return memo
                    }, {})
                    console.log('打印code，filenamek看看',filename)
                return {
                    contents: `export default ${JSON.stringify(cssModuleObject)};`,
                    loader: 'js',
                    resolveDir: dirname(args.path),
                }
            })
        },
    }
}
