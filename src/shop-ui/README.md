
# Shop UI

Vue.js UI Lib

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
  }
}
```

## Use

```
import ShopUI from './shop-ui'

Vue.use(ShopUI)
```
