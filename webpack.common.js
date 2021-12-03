const { resolve } = require('path');
const { readdirSync } = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const devMode = process.env.NODE_ENV !== 'production';

// 扫描js目录下的文件
const files = readdirSync(resolve(__dirname, 'src/js/'));
let entry = {};
for (let v of files) {
    if (/(.+?)\.js$/.test(v)) {
        entry[RegExp.$1] = './src/js/' + v;
    }
}
module.exports = {
    entry: entry, //多入口
    output: {
        path: resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].[contenthash:8].js',
        pathinfo: false,
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        modules: [resolve(__dirname, './node_modules')],
    },
    cache: {
        type: 'filesystem',
        cacheDirectory: resolve(__dirname, '.temp_cache'),
        buildDependencies: {
            config: [__filename],
        },
    },
    performance: {
        hints: false,
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserJSPlugin({}),
            new CssMinimizerPlugin({
                parallel: 2,
            }),
        ], //压缩css
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                common: {
                    name: 'common',
                    chunks: 'initial',
                    priority: 2,
                    minChunks: 2,
                },
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                    priority: 20,
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: ['babel-loader'], //'eslint-loader'
            },
            {
                test: /\.html$/,
                use: 'html-loader',
            },
            {
                test: /\.pug$/,
                use: [
                    'html-loader',
                    {
                        loader: 'pug-html-loader',
                        options: {
                            data: {
                                title: 'webpack pug',
                            },
                        },
                    },
                ],
            },
            {
                test: /\.css$/i,
                exclude: /node_modules/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            // Webpack4使用file-loader实现
            {
                test: /\.(eot|ttf|woff|woff2|svg)(\?.+)?$/,
                type: 'asset/resource',
                generator: {
                    filename: 'resource/[name][hash:8][ext]', // [ext]前面自带"."
                },
            },
            // Webpack4使用url-loader实现
            {
                test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
                type: 'asset',
                generator: {
                    filename: 'images/[name][ext]',
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024, //超过10kb不转base64
                    },
                },
            },
        ],
    },
    plugins: [
        new ProgressBarPlugin({ format: `:msg [:bar] :percent time :elapsed s` }), //编译进度
        new BundleAnalyzerPlugin(), //打包体积可视化分析
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/view/index.pug', //模版路径
            filename: 'index.html',
            favicon: './public/favicon.jpg',
            chunks: ['runtime', 'common', 'index', 'styles'],
        }),
        new HtmlWebpackPlugin({
            template: './src/view/404.pug',
            filename: '404.html',
            favicon: './public/favicon.jpg',
            chunks: [],
        }),
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
            ignoreOrder: true,
        }),
        new HotModuleReplacementPlugin(), //HMR
    ],
};
