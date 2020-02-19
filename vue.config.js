
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const ProxyURL = ''

module.exports = {
  devServer: {
    // disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      '/api': {
        target: ProxyURL,
        ws: false,
        changeOrigin: true,
        headers: {
          referer: ProxyURL,
          origin: ProxyURL
        }
      }
    }
  },

  configureWebpack: config => {
    config.entry = {
      base: [
        './src/main.js'
      ]
    }

    config.output.filename = '[name].raw.js'
    config.output.chunkFilename = '[id]-[chunkhash].raw.js'
  },

  chainWebpack: config => {
    // Optimization
    config.optimization.splitChunks(false)

    // ESLint
    config.module
      .rule('eslint')
      .use('eslint-loader')
      .tap(options => {
        options.fix = true // Auto Fix
        return options
      })
      .end()
    
    // Images
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        return Object.assign(options, {
          limit: 1024000
        })
      })
      .end()

    // Docs Block
    // 后面加上输出原始文本
    // ExtractTextPlugin.extract('raw-loader') & new ExtractTextPlugin('docs.md')
    config.module
      .rule('docs')
      .resourceQuery(/blockType=docs/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()

    // Shop UI SVG Sprite
    config.module
      .rule('shop-ui-svg')
      .test(/\.svg$/)
      .include
      .add(resolve('src/shop-ui/icons'))
      .end()
      .use('file-loader') // 修改原 SVG Rule 的
      .loader('svg-sprite-loader')
      .tap(options => {
        const _options = options || {}

        delete _options.name
        _options.symbolId = 'su-icon-[name]'

        return _options
      })
      .end()

    // Shop Kit SVG Sprite
    config.module
      .rule('shop-kit-svg')
      .test(/\.svg$/)
      .include
      .add(resolve('src/shop-kit/icons'))
      .end()
      .use('file-loader') // 修改原 svg Rule 的
      .loader('svg-sprite-loader')
      .tap(options => {
        const _options = options || {}

        delete _options.name
        _options.symbolId = 'sk-icon-[name]'

        return _options
      })
      .end()

    // SVG Sprite
    config.module
      .rule('svg')
      .test(/\.svg$/)
      .include
      .add(resolve('src/icons'))
      .end()
      .use('file-loader') // 修改原 svg Rule 的
      .loader('svg-sprite-loader')
      .tap(options => {
        const _options = options || {}

        delete _options.name
        _options.symbolId = filePath => {
          const oPath = path.parse(filePath)
          const dirs = oPath.dir.replace(resolve('src/icons')).split(path.sep)
          const prefix = dirs.slice(2).join('-') // 只获取 svg 的子目录
          return `icon-${prefix ? (prefix + '-') : ''}${oPath.name}`
        }
        // _options.symbolId = 'icon-[name]'

        return _options
      })
      .end()

    // Delete Uses
    // CSSNano 兼容性问题，CSS 规则顺序被改变，先去掉
    config.module.rule('css').oneOf('vue-modules').uses.delete('cssnano').end()
    config.module.rule('css').oneOf('vue').uses.delete('cssnano').end()
    config.module.rule('css').oneOf('normal-modules').uses.delete('cssnano').end()
    config.module.rule('css').oneOf('normal').uses.delete('cssnano').end()

    config.module.rule('postcss').oneOf('vue-modules').uses.delete('cssnano').end()
    config.module.rule('postcss').oneOf('vue').uses.delete('cssnano').end()
    config.module.rule('postcss').oneOf('normal-modules').uses.delete('cssnano').end()
    config.module.rule('postcss').oneOf('normal').uses.delete('cssnano').end()

    // HTML
    config.plugin('html')
      .tap(args => {
        args[0].inject = process.env.NODE_ENV !== 'production'
        return args
      })
      .end()

    // Delete Plugins
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')

    // CSS Normal
    // 插入到 <title> 元素上面
    // const cssRule = config.module.rule('css').oneOf('normal')
    // cssRule.uses.clear()
    // cssRule.use('style-loader').loader('style-loader').tap(options => {
    //   options = options || {}
    //   options.insertAt = {
    //     before: 'title'
    //   }
    //   return options
    // })
    // cssRule.use('css-loader').loader('css-loader').tap(options => {
    //   options = options || {}
    //   options.sourceMap = false
    //   options.importLoaders = 2
    //   return options
    // })
    // cssRule.use('postcss-loader').loader('postcss-loader').tap(options => {
    //   options = options || {}
    //   options.sourceMap = false
    //   return options
    // })
  },

  filenameHashing: false,
  productionSourceMap: false,

  css: {
    extract: false
    // extract: !(process.env.NODE_ENV === 'production') ? false : {
    //   filename: '[name].raw.css',
    //   chunkFilename: '[id]-[chunkhash].raw.css'
    // }
  },

  pluginOptions: {
    i18n: {
      locale: 'zh-CN',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}
