<template>
  <div class="s-upload">
    <div class="s-upload-item" v-for="(img, index) in imgs" :key="index" :style="`background-image:url('${img.src}')`">
      <div class="s-delete">
        <span class="s-delete-btn" @click="fnDelete(index)">删除</span>
      </div>
    </div>
    <div v-if="imgs.length < size" class="s-upload-item s-upload-btn">
      <div class="s-cont">
        <sk-icon name="plus" class="s-icon"></sk-icon>
        <p>上传凭证</p>
        <p>(最多{{size}}张)</p>
        <input type="file" class="s-file-input" @change="fileChange" accept="image/*" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: [Number, String],
      default () {
        return 3
      }
    }
  },
  data () {
    return {
      imgs: [],
      assetsURL: /yurl.vip/g.test(window.location.origin) ? '//asset.test.yurl.vip' : '//asset.ibanquan.com'
    }
  },
  methods: {
    fileChange (evt) {
      const file = evt.target.files[0]

      this.checkImgSize(file, (err) => {
        if (err) {
          this.$toast.info(err)
        }

        const formData = new FormData()
        formData.append('file_name', file.name)
        formData.append('image_file', file)

        this.fnUploadFormData(formData, (res) => {
          // const src = this.$sdk.util.getImageUrl(res.file.id, res.file.file_name, '', res.file.epoch)
          this.imgs.push({ src: `${this.assetsURL}${res.file.src}`, id: res.file.id })
          this.$emit('change', this.imgs)
        })

        // let reader = new FileReader()
        // reader.onload = (evt) => {
        //   var width = 0
        //   var height = 0
        //   var data = evt.target.result
        //   var image = new Image()
        //   image.onload = () => {
        //     width = image.width
        //     height = image.height
        //     const oData = {
        //       file_name: file.name,
        //       base64: data,
        //       width: width,
        //       height: height
        //     }
        //     this.fnUpload(oData, (res) => {
        //       // const src = this.$sdk.util.getImageUrl(res.file.id, res.file.file_name, '', res.file.epoch)
        //       // console.log(src)
        //       // console.log(`${this.assetsURL}${res.file.src}`)
        //       this.imgs.push({ src: `${this.assetsURL}${res.file.src}`, id: res.file.id })
        //       this.$emit('change', this.imgs)
        //     })
        //   }
        //   image.src = data
        // }
        // reader.readAsDataURL(file)
      })
      // console.log(this.imgs)
    },
    checkImgSize (file, cb) {
      let err = ''
      const fileTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (fileTypes.indexOf(file.type) < 0) {
        err = '不支持此文件类型'
      }
      const fileMaxSize = 1024 * 1024 * 8
      if (file.size > fileMaxSize) {
        err = '图片大小不能大于8M'
      }
      cb && cb(err)
    },
    fnDelete (index) {
      this.imgs.splice(index, 1)
      // console.log(this.imgs)
      this.$emit('change', this.imgs)
    },
    fnUploadFormData (formData, cb) {
      window.fetch(`/api/v1/service/upload_image`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      }).then(function (oRes) {
        return oRes.json()
      }).then(function (oData) {
        if ((oData || {}).code === 200) {
          cb && cb(oData)
        } else {
          this.$toast.info(oData.message || '上传失败，请重试！')
        }
      }).catch(oError => {
        console.log(oError)
      })
    },
    fnUpload (data, cb) {
      this.$sdk.service.upload_image(data, function (res) {
        // console.log(res)
        if (res.res.code === 200) {
          cb && cb(res.res)
        } else {
          this.$toast.info(res.res.message || '上传失败，请重试！')
        }
      })
    }
  }
}
</script>

<style scoped>
p {
  margin: 0;
  line-height: 1.4;
}
.s-upload {
  display: flex;
  flex-wrap: wrap;
}
.s-upload-item {
  position: relative;
  width: 30%;
  height: 0;
  margin-right: 3%;
  margin-bottom: 10px;
  padding-bottom: 30%;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  box-sizing: border-box;
  transition: all .4s;
}
.s-upload-item:nth-child(3n + 3) {
  margin-right: 0;
}
.s-upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #999;
}
.s-cont {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.s-delete {
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #fff;
  background: rgba(0,0,0, 0.6);
}
.s-upload-item:hover .s-delete{
  display: flex;
  transition: all .4s;
}
.s-delete-btn {
  padding: 5px;
  cursor: pointer;
}
.s-icon {
  width: 24px;
  height: 24px;
  margin: 4px;
}
.s-file-input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
</style>
