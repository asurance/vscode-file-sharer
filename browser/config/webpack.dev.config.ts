import Merge from 'webpack-merge'
import BaseConfig from './webpack.base.config'
import type { Configuration } from 'webpack'

const config = {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        port: 45862,
        disableHostCheck: true,
        host: '0.0.0.0',
    },
} as Configuration

export default Merge(BaseConfig, config)