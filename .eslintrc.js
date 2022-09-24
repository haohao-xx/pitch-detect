/** @format */

module.exports = {
    root: true,
    //parser: 'babel-eslint',
    parser: '@typescript-eslint/parser', //定义ESLint的解析器
    extends: ['plugin:prettier/recommended'], //定义文件继承的子规范
    plugins: ['@typescript-eslint'], //定义了该eslint文件所依赖的插件
    env: {
        node: true,
        browser: true,
        es6: true,
    },
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
}
