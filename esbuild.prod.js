/** @format */

const lessPlugin = require('esbuild-plugin-less')
//const cssLoader = require('./css-loader').cssLoader
const cssLoader = require('esbuild-css-modules-plugin')
//const lessLoader = require('./less-loader').lessLoader
console.log('打印cssloader', cssLoader)

require('esbuild')
    .build({
        entryPoints: ['src/index.tsx'],
        outfile: 'esbuild/output.js',
        bundle: true,
        loader: {'.png': 'file'},
        publicPath: 'http://127.0.0.1:5500/public/',
        plugins: [lessPlugin.lessLoader(),cssLoader()],
    })
    .then(() => console.log('Done'))
    .catch(() => process.exit(1))
