/** @format */

const lessPlugin = require('esbuild-plugin-less')
const cssmodulePlugin = require('esbuild-css-modules-plugin')

require('esbuild')
    .serve(
        {
            servedir: 'esbuild',
            port: 9001,
            host: 'localhost',
        },
        {
            entryPoints: ['src/index.tsx'],
            outfile: 'esbuild/output.js',
            bundle: true,
            publicPath: 'http://127.0.0.1:5500/public',
            loader: {'.png': 'dataurl'},
            plugins: [lessPlugin.lessLoader(), cssmodulePlugin()],
        },
    )
    .then(server => {
        console.log('Done')
    })
