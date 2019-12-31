
export function toComponentName (variable) {
  variable = variable.replace(/-+[a-zA-Z]/g, function (str, index) {
    return index ? str.substr(-1).toUpperCase() : str
  })

  // 首字母大写
  return variable.replace(/^[a-zA-Z]/g, function (str) {
    return str.substr(-1).toUpperCase()
  })
}
