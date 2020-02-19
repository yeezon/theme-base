
# Shop Kit

Vue.js Kit

## Packages

```
"devDependencies": {
  "svg-sprite-loader": "^4.1.6"
}
```

## Config

### vue.config.js

```
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  chainWebpack: config => {
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
  }
}
```

## Use

```
import ShopKit from './shop-kit'

Vue.use(ShopKit)
```
