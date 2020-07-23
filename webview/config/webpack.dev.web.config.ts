import Merge from 'webpack-merge'
import { resolve } from 'path'
import BaseConfig from './webpack.base.config'
import type { Configuration } from 'webpack'

const config = {
    entry: {
        index: resolve(__dirname, '../src/debug.ts')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                }
            }
        ]
    },
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        port: 65432,
    },
} as Configuration

export default Merge(BaseConfig, config)