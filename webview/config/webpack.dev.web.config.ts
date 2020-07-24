import { resolve } from 'path'
import type { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const config = {
    entry: {
        index: resolve(__dirname, '../src/debug.tsx')
    },
    module: {
        rules: [
            {
                test: /\.tsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ title: 'vscode qrcode', template: resolve(__dirname, '../index.html') })
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