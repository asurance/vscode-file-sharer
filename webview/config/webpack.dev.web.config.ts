import Merge from 'webpack-merge'
import { resolve } from 'path'
import BaseConfig from './webpack.base.config'
import type { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const config = {
    plugins: [
        new HtmlWebpackPlugin({ title: 'vscode qrcode', template: resolve(__dirname, '../debug.html') })
    ],
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        port: 65432,
    },
} as Configuration

export default Merge(BaseConfig, config)