
export default function (sdk) {
  // 类 Vue 的 $on 和 $emit
  sdk.on = sdk.events.subscribe
  sdk.emit = sdk.events.publish
  // End 类 Vue 的 $on 和 $emit

  return sdk
}
