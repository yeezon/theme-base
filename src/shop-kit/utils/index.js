
export function timestampToTime (data) {
  const date = new Date(data)// 如果date为13位不需要乘1000
  const Y = date.getFullYear() + '年'
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月'
  const D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + '日'
  const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  const s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  return Y + M + D + h + m + s
}

export function countTime (starttime, endtime) {
  const endTime = new Date(endtime)
  const startTime = new Date(starttime)
  const leftTime = parseInt((endTime.getTime() - startTime.getTime()) / 1000)
  const d = parseInt(leftTime / (24 * 60 * 60))
  const h = parseInt(leftTime / (60 * 60) % 24).toString().padStart(2, '0')
  const m = parseInt(leftTime / 60 % 60).toString().padStart(2, '0')
  const s = parseInt(leftTime % 60).toString().padStart(2, '0')
  return `${d}天${h}小时${m}分${s}秒`
}
