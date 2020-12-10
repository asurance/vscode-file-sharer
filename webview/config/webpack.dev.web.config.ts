import { resolve } from 'path'
import type { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

const config = {
    entry: {
        index: resolve(__dirname, '../src/debug.tsx')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: true,
                            modules: {
                                namedExport: true,
                            },
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            esModule: true,
                            modules: {
                                namedExport: true,
                            },
                        },
                    },
                ]
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ title: 'vscode qrcode', template: resolve(__dirname, '../index.html') }),
        new MiniCssExtractPlugin(),
    ],
    resolve: {
        extensions: ['.ts', '.js', '.tsx']
    },
    devServer: {
        port: 65432,
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname, '../../public'),
    }
} as Configuration

export default config