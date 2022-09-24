/** @format */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = {
    name: 'pitch-detect',
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].bundle.js',
        clean: true,
    },
    resolve: {
        extensions: ['.jsx', '.tsx', '.js', '.ts'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
        fallback: {
            buffer: require.resolve('buffer/'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(less)$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            import: true, //禁止或启用@import, 默认true
                        },
                    },
                    'postcss-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                javascriptEnabled: true,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(css)$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            //modules:true,
                            import: true, //禁止或启用@import, 默认true
                        },
                    },
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(js|jsx|tsx|ts)$/,
                loader: 'babel-loader',
                include: [path.join(__dirname, 'src'), path.join(__dirname, 'public')],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'pitch-detect',
        }),
        new ESLintPlugin(),
    ],
}
