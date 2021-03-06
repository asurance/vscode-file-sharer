import Merge from 'webpack-merge'
import BaseConfig from './webpack.base.config'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import type { Configuration } from 'webpack'

const config = {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin()
    ]
} as Configuration

export default Merge(BaseConfig, config)