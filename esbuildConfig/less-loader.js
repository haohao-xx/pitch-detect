/** @format */
const parcelCSS = require('@parcel/css')
const less = require('less')
const readFileSync = require('fs').readFileSync
const path = require('path')

const {basename, dirname, extname, join, resolve} = path

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
module.exports.lessLoader = (opts = {}) => {
    const {lessOptions = {}} = opts
    return {
        name: 'less-loader',
        setup: build => {
            // Resolve *.less files with namespace
            build.onResolve({filter: /\.less$/, namespace: 'file'}, args => {
                const filePath = join(args.resolveDir, args.path)
                console.log('打印resolve参数',filePath)
                return {
                    path: filePath,
                    watchFiles: !!build.initialOptions.watch ? [filePath, ...getLessImports(filePath)] : undefined,
                }
            })

            // Build .less files
            build.onLoad({filter: /\.less$/, namespace: 'file'}, async args => {
                const content = readFileSync(args.path, 'utf-8')
                const dir = dirname(args.path)
                const filename = basename(args.path)
                const relFilename = winPath(args.path)
                console.log(dir)
                try {
                    const result = await less.render(content, {
                        filename,
                        rootpath: dir,
                        ...lessOptions,
                        paths: [...(lessOptions.paths || []), dir],
                    })
                    const classNames = getClassNames(Buffer.from(result.css), filename).sort()
                    const cssModuleObject = classNames.reduce((memo, key) => {
                        memo[key] = `${key}___${hashString(`${relFilename}@${key}`)}`
                        return memo
                    }, {})
                    return {
                        contents: `export default ${JSON.stringify(cssModuleObject)};`,
                        loader: 'js',
                        resolveDir: dir,
                    }
                } catch (e) {
                    return {
                        errors: [convertLessError(e)],
                        resolveDir: dir,
                    }
                }
            })
        },
    }
}

const importRegex = /@import(?:\s+\((.*)\))?\s+['"](.*)['"]/
const globalImportRegex = /@import(?:\s+\((.*)\))?\s+['"](.*)['"]/g
const importCommentRegex = /\/\*[\s\S]*?\*\/|(\/\/.*$)/gm

const extWhitelist = ['.css', '.less']
//const extWhitelist = ['.less']

/** Recursively get .less/.css imports from file */
const getLessImports = filePath => {
    try {
        const dir = dirname(filePath)
        const content = readFileSync(filePath).toString('utf8')

        const cleanContent = content.replace(importCommentRegex, '')
        const match = cleanContent.match(globalImportRegex) || []

        const fileImports = match
            .map(el => {
                const match = el.match(importRegex)
                return match ? match[2] : ''
            })
            .filter(el => !!el)
            // NOTE: According to the docs, extensionless imports are interpreted as '.less' files.
            // http://lesscss.org/features/#import-atrules-feature-file-extensions
            // https://github.com/iam-medvedev/esbuild-plugin-less/issues/13
            .map(el => resolve(dir, extname(el) ? el : `${el}.less`))

        const recursiveImports = fileImports.reduce((result, el) => {
            return [...result, ...getLessImports(el)]
        }, fileImports)
        return recursiveImports.filter(el => extWhitelist.includes(extname(el).toLowerCase()))
    } catch (e) {
        return []
    }
}

/** Convert less error into esbuild error */
const convertLessError = error => {
  console.log('打印错误信息',error)
    const sourceLine = error.extract.filter(line => line)
    const lineText = sourceLine.length === 3 ? sourceLine[1] : sourceLine[0]
    return {
        text: error.message,
        location: {
            namespace: 'file',
            file: error.filename,
            line: error.line,
            column: error.column,
            lineText,
        },
    }
}
