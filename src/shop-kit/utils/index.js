
export function timestampToTime (data) {
  var date = new Date(data)// 如果date为13位不需要乘1000
  var Y = date.getFullYear() + '年'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月'
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + '日'
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  return Y + M + D + h + m + s
}

export function countTime (starttime, endtime) {
  const endTime = new Date(endtime)
  const startTime = new Date(starttime)
  let leftTime = parseInt((endTime.getTime() - startTime.getTime()) / 1000)
  const d = parseInt(leftTime / (24 * 60 * 60))
  const h = parseInt(leftTime / (60 * 60) % 24).toString().padStart(2, '0')
  const m = parseInt(leftTime / 60 % 60).toString().padStart(2, '0')
  const s = parseInt(leftTime % 60).toString().padStart(2, '0')
  return `${d}天${h}小时${m}分${s}秒`
}
