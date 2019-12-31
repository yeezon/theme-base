
// 改成 import JSSDK
function getImageUrl (imageID, imageName, imageSize, imageEpoch) {
  if (!imageID || !imageName) {
    var aDef = window.productImage.split('.')
    aDef[0] = aDef[0] + '_' + imageSize
    var sDef = aDef.join('.')
    var sPath = window.assetPath
    if (!sPath) {
      sPath = window.assetHost
    }
    sDef = sPath + sDef
    return sDef
  }
  var sHost = window.assetHost
  if (!sHost) {
    sHost = window.assetPath
  }
  sHost = sHost + imageID + '/'
  var sFileName = imageName
  if (imageSize) {
    var aSplit = imageName.split('.')
    var nLen = aSplit.length
    if (nLen > 1) {
    // var sImageSize = '_' + imageSize;
    // var sFileNotExt = aSplit[nLen - 2];
    // aSplit[nLen - 2] = sFileNotExt + sImageSize;
    // sFileName = aSplit.join('.');
      var sImageSize = 's_' + imageSize
      var sFileExtName = aSplit.pop()
      sFileName = sImageSize + '.' + sFileExtName
    } else {
    // alert('文件没有后缀名？');
    }
  }
  sHost = sHost + sFileName
  if (imageEpoch) {
    sHost = sHost + '?v=' + imageEpoch
  }
  return sHost
}

function imgURL (image, size = '') {
  // size 为 '' 即为原尺寸

  // 根据屏幕自动优化大小
  const nDevicePixelRatio = window.devicePixelRatio || 1
  let [width, height] = size.split('x')

  width = nDevicePixelRatio * Number(width || 0)
  height = nDevicePixelRatio * Number(height || 0)

  if (width && height) {
    size = `${width}x${height}`
  }

  if (typeof image === 'object') {
    return getImageUrl(image.image_id, image.image_name, size, image.image_epoch)
  } else {
    const imageID = (image.match(/\/image\/([^/]*)/) || [null, image])[1] || ''
    const imageEpoch = (image.match(/v=([\d]*)/) || [])[1] || ''

    return getImageUrl(imageID, 's.png', size, imageEpoch)
  }
}

export default imgURL
