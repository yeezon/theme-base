<template>
  <div class="sk-personal-info">
    <div class="s-account-sideCont">
      <div class="s-account-sideCont-block s-personal-info">
        <h3>个人资料</h3>
        <div class="avatar">
          <div class="s-avatar_box" v-if="customer.avatar_url">
            <img class="s-avatar_img" :src="customer.avatar_url" title="个人头像" alt="个人头像">
          </div>
          <a href="javascript:void(0);" class="avatar-link" @click="avatarModify">修改头像</a>
        </div>
        <table class="">
          <tbody>
            <tr>
              <td>昵称</td>
              <td>： </td>
              <td>{{customer.name || '未填写'}}</td>
            </tr>
            <tr>
              <td>真实姓名</td>
              <td>： </td>
              <td>{{customer.real_name || '未填写'}}</td>
            </tr>
            <tr>
              <td>身份证号</td>
              <td>： </td>
              <td>{{customer.indentity_card || '未填写'}}</td>
            </tr>
            <tr>
              <td>生日</td>
              <td>： </td>
              <td v-if="customer.birthday">{{customer.birthday | date('yyyy-MM-dd')}}</td>
              <td v-else>未填写</td>
            </tr>
            <tr>
              <td>电子邮箱</td>
              <td>： </td>
              <td>{{customer.notify_email || '未填写'}}</td>
            </tr>
            <tr> </tr>
            <tr>
              <td>手机号码</td>
              <td>： </td>
              <td>{{customer.notify_phone ? customer.notify_phone.replace(/(\d{3})\d{4}(\d+)/, '$1****$2') : '未填写'}}</td>
            </tr>
            <tr>
              <td>性别</td>
              <td>： </td>
              <td v-if="customer.sex === 'undefined'">保密</td>
              <td v-if="customer.sex === 'male'">男</td>
              <td v-if="customer.sex === 'female'">女</td>
            </tr>
          </tbody>
        </table>
        <su-button type="primary" size="small" class="modify-info" @click="modify">修改</su-button>
        <su-button type="danger" size="small" class="remove-info" @click="removeAccount">注销账号</su-button>
      </div>
      <div class="s-account-sideCont-block s-vip-level">
        <h5 v-if="pointsStatus">
          <sk-icon name="reward_point" class="personal-icon"></sk-icon>积分：<span>{{customer.point || 0}}</span>
        </h5>
        <h5>
          <sk-icon name="point" class="personal-icon"></sk-icon>经验值：<span>{{customer.total_credit || 0}}</span>
        </h5>
        <h5>
          <sk-icon name="grade" class="personal-icon"></sk-icon>会员等级：<span>{{customer.customer_level ?
            customer.customer_level.name : '-'}}</span>
        </h5>
      </div>
    </div>

    <!-- 更换头像 -->
    <su-dialog :open="avatarModifyDialog" @close="avatarModifyDialog = false">
      <div slot="title" class="s-dialog-title">修改头像</div>
      <div class="s-dialog-con">
        <div class="s-change-personal-avatar">
          <div class="img">
            <img :src="avatar_url" alt="预览头像">
          </div>
          <div class="title">请上传JPG或PNG格式，小于5M的图片文件</div>
          <small>推荐尺寸 90*90px</small><br>
          <su-button type="primary" size="small">选择头像
          <!-- <form ref="avatarForm" action="/account/upload_avatar" method="post" accept-charset="UTF-8" enctype="multipart/form-data"
            target="uploader" @change="avatarChange">
            <input accept="image/gif, image/jpeg, image/png, image/bmp" name="avatar" type="file" ref="file">
          </form> -->
          <form id="avatarForm">
            <input type="file" ref="file" class="s-file" name="image" accept="image/gif, image/jpeg, image/png, image/bmp" @change="avatarChange">
          </form>
          </su-button>

        </div>
      </div>
      <div slot="footer">
        <div class="s-ctrl-btns">
          <su-button type="primary" @click="uploadAvatar">确定</su-button>
          <su-button type="button" @click="avatarModifyDialog = false">取消</su-button>
        </div>
      </div>
    </su-dialog>

    <!-- 上传进度 -->
    <su-dialog :open="uploadDialog" @close="uploadDialog = false">
      <div slot="title" class="s-dialog-title">正在上传图片</div>
      <div class="s-dialog-con">
        正在上传图片: {{localImgName}}
      </div>
      <div slot="footer">
        <div class="s-progress">
          <div :style="{width: imgLoadProgress + '%'}"></div>
        </div>
      </div>
    </su-dialog>
    <!--  -->

    <!-- 修改信息 -->
    <su-dialog :open="modifyDialog" @close="modifyDialog = false">
      <div slot="title" class="s-dialog-title">修改个人资料</div>
      <div class="s-dialog-con">
        <su-form ref="form" :model="oCustomer" :rules="oRules">
        <su-form-item prop="name">
          <su-input placeholder="昵称" v-model.trim="oCustomer.name"></su-input>
        </su-form-item>
        <su-form-item prop="real_name">
          <su-input placeholder="真实姓名" v-model.trim="oCustomer.real_name"></su-input>
        </su-form-item>
        <su-form-item prop="indentity_card">
          <su-input placeholder="身份证号" v-model="oCustomer.indentity_card"></su-input>
        </su-form-item>
        <su-form-item prop="notify_email">
          <su-input placeholder="电子邮箱" v-model="oCustomer.notify_email"></su-input>
        </su-form-item>
        <su-form-item prop="notify_phone">
          <su-input type="tel" placeholder="手机号码" v-model.trim="oCustomer.notify_phone"></su-input>
        </su-form-item>
        <su-form-item prop="birthday">
          <su-date :value="oCustomer.birthday" @change="birthdayChange"></su-date>
        </su-form-item>
        <su-form-item prop="district_code" class="s-sex-radio">
          <span>性别</span>
          <su-radio-group :value="oCustomer.sex" @input="sexChange">
            <su-radio :val="'undefined'">保密</su-radio>
            <su-radio :val="'male'">男</su-radio>
            <su-radio :val="'female'">女</su-radio>
          </su-radio-group>
        </su-form-item>
      </su-form>
      </div>
      <div slot="footer">
        <div class="s-ctrl-btns">
          <su-button type="primary" size="large" @click="confirmModify">确定</su-button>
          <su-button slot="right" type="button" size="large" @click="modifyDialog = false">取消</su-button>
        </div>
      </div>
    </su-dialog>
    <!--  -->

    <!-- 注销账号 -->
    <su-dialog :open="removeAccountDialog" @close="removeAccountDialog = false">
      <div slot="title" class="s-dialog-title">注销账号</div>
      <div class="s-dialog-con">
        <p class="tips-text">提示： 该操作具有一定危险！请谨慎操作</p>
        <p class="tips-text">注销帐号将删除当前帐号在本网站的用户和订单信息，以后将无法再使用当前帐号进行登录网站。</p>
        <p class="tips-text">确定要注销帐号吗？</p>
      </div>
      <div slot="footer">
        <div class="s-ctrl-btns">
          <su-button type="danger" @click="comfirmRemoveAccount">确定注销</su-button>
          <su-button slot="right" type="button" @click="removeAccountDialog = false">取消</su-button>
        </div>
      </div>
    </su-dialog>
    <!--  -->

    <!-- 已注销账号 提示 -->
    <su-dialog :open="removeAccountDoneDialog" @close="goHome">
      <div slot="title" class="s-dialog-title">注销账号</div>
      <div class="s-dialog-con">
        账号已注销！
      </div>
      <div slot="footer">
        <div class="s-ctrl-btns">
          <su-button type="primary" size="large" @click="goHome">确定</su-button>
        </div>
      </div>
    </su-dialog>

    <!--  -->
    <!-- <iframe name="uploader" style="display: none;" @load="iframeLoad"></iframe> -->
  </div>
</template>
<script>
export default {
  data () {
    return {
      customer: {},
      oCustomer: {},
      avatarModifyDialog: false,
      uploadDialog: false,
      modifyDialog: false,
      removeAccountDialog: false,
      removeAccountDoneDialog: false,
      avatarChangeStatus: false,
      pointsStatus: false,
      avatar_url: '',
      localImgName: '头像',
      imgLoadProgress: 8,
      oRules: {
        birthday: [
          { required: true, message: '请选择生日', trigger: 'blur' }
        ],
        notify_phone: [
          { min: 11, message: '手机号码格式不正确', trigger: 'blur' }
        ],
        indentity_card: [
          { min: 15, message: '身份证格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getPersonalInfo()
    this.checkPointsStatus()
  },
  methods: {
    getPersonalInfo: function () {
      this.$sdk.account.current(({
        res
      }) => {
        if (res.code === 200) {
          this.customer = res.customer
        } else {
          alert(res.message || '未知错误')
        }
      })
    },
    // 积分开启状态
    checkPointsStatus: function () {
      this.$sdk.reward_point.get(data => {
        this.pointsStatus = data.res.enabled || false
      })
    },
    // 修改个人资料
    modify: function () {
      this.modifyDialog = true
      this.oCustomer = {
        name: this.customer.name,
        real_name: this.customer.real_name,
        indentity_card: this.customer.indentity_card,
        notify_email: this.customer.notify_email,
        notify_phone: this.customer.notify_phone,
        birthday: this.customer.birthday,
        sex: this.customer.sex
      }
    },
    // 注销账号 dialog
    removeAccount: function () {
      this.removeAccountDialog = true
    },
    // 修改头像 dialog
    avatarModify: function () {
      this.avatarModifyDialog = true
      this.avatar_url = this.customer.avatar_url || ''
    },
    // 注销账号
    comfirmRemoveAccount: function () {
      this.$sdk.account.remove(data => {
        if (data.res.code === 200) {
          this.removeAccountDialog = false
          this.removeAccountDoneDialog = true
        } else {
          alert(data.res.message || '注销失败，请重试！')
        }
      })
    },
    // 注销账号后回到首页
    goHome: function () {
      this.$router.push('/')
    },
    // 头像处理
    avatarChange: function (evt) {
      const self = this
      self.imgLoadProgress = 8
      // 防止始化时触发iframe load事件
      self.avatarChangeStatus = true
      if (!window.FileReader) {
        // 不兼容预览的浏览器
        self.avatar_url = ''
      } else {
        const img = event.target.files[0]
        self.localImgName = img.name
        const reader = new FileReader()
        reader.onload = (function (file) {
          return function (evt) {
            self.avatar_url = evt.target.result
          }
        })(img)
        reader.readAsDataURL(img)
      }
    },
    // 上传图片
    uploadAvatar: function () {
      this.avatarModifyDialog = false
      if (!this.avatarChangeStatus) return

      const formData = new FormData()
      const file = this.$refs.file.files[0]
      formData.append('avatar', file)

      window.fetch('/account/upload_avatar', {
        // headers: {
        //   'Content-Type': 'multipart/form-data'
        // },
        method: 'POST',
        credentials: 'include',
        body: formData
      })
        // .then(response => response.json())
        .catch(error => {
          console.error('Error:', error)
        })
        .then(response => {
          this.uploadDialog = true
          this.iframeLoad()
          // console.log('Success:', response)
        })
      // this.$refs.avatarForm.submit()
    },
    // iframeLoad
    iframeLoad: function (e) {
      const self = this
      if (!self.avatarChangeStatus) return
      const progressInter = setInterval(function () {
        if (self.imgLoadProgress > 100) {
          clearInterval(progressInter)
          self.getPersonalInfo()
          self.uploadDialog = false
          self.avatarChangeStatus = false
          return
        }
        self.imgLoadProgress = self.imgLoadProgress + 10 * Math.random() + 10
      }, 100)
    },
    //
    birthdayChange: function (evt) {
      this.oCustomer.birthday = evt.date
    },
    //
    sexChange: function (sex) {
      this.oCustomer.sex = sex
    },
    // 表单验证
    fnValidate (cb) {
      this.$refs.form.validate(valid => {
        cb(valid)

        if (!valid) {
          return false
        }
      })
    },
    // 修改资料
    confirmModify: function () {
      this.fnValidate(valid => {
        if (!valid) return
        const oForm = {
          name: this.oCustomer.name,
          real_name: this.oCustomer.real_name,
          indentity_card: this.oCustomer.indentity_card,
          notify_email: this.oCustomer.notify_email,
          notify_phone: this.oCustomer.notify_phone,
          birthday: this.oCustomer.birthday,
          sex: this.oCustomer.sex
        }
        // 筛选剔除空值
        for (const i in oForm) {
          if (!oForm[i]) {
            delete oForm[i]
          }
        }
        // 更新
        this.$sdk.account.save(oForm, ({ res }) => {
          if (res.code === 200) {
            this.modifyDialog = false
            this.getPersonalInfo()
          } else if (res.code === 201 && res.msg) {
            this.$toast.info(res.msg.desc || '未知错误') // 兼容脱敏检测错误反馈
          } else {
            this.$confirm({
              title: '修改个人资料',
              msg: res.message
            }).then(() => {
              // console.log(1111)
            }).catch(() => {
              // window.console.log('close')
            })
          }
        })
      })
    }
  },
  components: {}
}
</script>
<style scoped>
  .s-account-sideCont {
    display: inline-block;
    width: 888px;
    vertical-align: top;
  }

  .s-account-sideCont-block h3 {
    padding: 30px 30px 20px;
    font-weight: 400;
    font-size: 24px;
    margin: 0;
  }

  .s-vip-level {
    border: 1px solid #ddd;
    border-top: none;
    border-radius: 0 0 3px 3px;
    font-size: 14px;
    padding: 30px;
    color: #333333;
    background: #ffffff;
  }

  .s-vip-level h5 {
    margin: 5px 0;
    font-weight: bold;
    font-size: 14px;
    line-height: 22px;
  }

  .s-personal-info {
    padding-bottom: 40px;
    border-radius: 3px 3px 0 0;
    position: relative;
    background: #fff;
    border: 1px solid #ddd;
  }

  .s-personal-info .avatar {
    display: inline-block;
    padding: 0 30px;
    font-size: 14px;
    width: 96px;
    text-align: center;
    vertical-align: top;
  }

  .s-personal-info .avatar>div {
    position: relative;
    width: 90px;
    height: 90px;
    line-height: 88px;
    border-radius: 100%;
    overflow: hidden;
    margin-bottom: 12px;
    border: 3px solid #fff;
    box-shadow: 0 0 1px 1px #d6d6d6;
  }

  .s-account-tags,
  .personal-security h3 {
    border-bottom-width: 1px;
    border-bottom-style: solid;
  }

  .s-personal-info .avatar>div:before {
    display: inline-block;
    width: 0;
    height: 100%;
    vertical-align: middle;
  }

  .s-personal-info .avatar .avatar-link {
    color: #48e;
  }

  .s-avatar_img {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    vertical-align: middle;
    object-fit: contain;
  }

  .s-avatar_box {

  }

  .s-personal-info .avatar a {
    text-decoration: none;
  }

  .s-personal-info table {
    font-size: 14px;
    width: 608px;
    line-height: 24px;
    display: inline-block;
    border-left-width: 1px;
    border-left-style: solid;
    padding-left: 30px;
    color: #666;
    border-color: #ddd;
  }

  .s-personal-info tr td {
    min-width: 20px;
  }

  .s-personal-info tr td:first-child {
    width: 56px;
    text-align: justify;
    text-justify: distribute-all-lines;
    text-align-last: justify;
    -moz-text-align-last: justify;
    -webkit-text-align-last: justify;
  }

  .s-personal-info .modify-info {
    position: absolute;
    min-width: 67px;
  }

  .s-personal-info .remove-info {
    position: absolute;
    top: 125px;
    margin-left: 0;
    /* padding: 0 8px; */
  }

  /*  */
  .s-btn {
    display: inline-block;
    border: 1px solid;
    transition: all 0.3s;
    text-decoration: none;
    text-align: center;
    border-radius: 3px;
    outline: 0;
    box-sizing: border-box;
  }

  .s-btn.active,
  .s-btn:hover {
    opacity: 0.93;
    filter: alpha(Opacity=93);
  }

  .s-btn:active {
    opacity: 0.85;
    filter: alpha(Opacity=85);
  }

  .s-btn-sm {
    font-size: 12px;
    padding: 0 20px;
    height: 26px;
    line-height: 24px;
  }

  .s-btn-md {
    font-size: 14px;
    padding: 0 40px;
    height: 38px;
    line-height: 36px;
  }

  .s-btn-primary {
    background: #4685ee;
    color: #fff;
    border-color: #4685ee;
  }

  .s-btn-warning {
    color: #fff;
    background: #f71;
    border-color: #f71;
  }

  .s-btn-secondary {
    background: #999999;
    color: #ffffff;
    border-color: #999999;
  }

  .personal-icon {
    width: 1.1em;
    height: 1.1em;
    vertical-align: -0.2em;
    margin-right: 8px;
    color: #d5d5d5;
  }

  /*dialog */
  .s-dialog-title {
    font-size: 18px;
    margin: 0 0 30px;
    padding-right: 30px;
    font-weight: bold;
  }

  .s-dialog-con {
    width: 500px;
  }

  .s-dialog-con .tips-text {
    font-size: 14px;
    color: #666;
  }

  .s-ctrl-btns {
    margin-top: 30px;
  }

  .s-ctrl-btns .s-btn {
    margin-right: 20px;
  }

  .s-change-personal-avatar .img {
    width: 118px;
    height: 118px;
    background: #eeeff0;
    text-align: center;
    color: #ffffff;
    font-size: 20px;
    cursor: pointer;
    border-radius: 3px;
    border: 1px solid #dddddd;
    -webkit-transition: all 0.2s;
    transition: all 0.2s;
    float: left;
    margin-right: 20px;
  }

  .s-change-personal-avatar .img:before {
    content: "";
    display: inline-block;
    width: 0;
    height: 100%;
    vertical-align: middle;
  }

  .s-change-personal-avatar .img img {
    vertical-align: middle;
    max-width: 100%;
    max-height: 100%;
  }

  .s-change-personal-avatar {
    overflow: hidden;
  }
  .s-change-personal-avatar /deep/ .su-button {
    position: relative;
  }

  .s-change-personal-avatar small {
    color: #999999;
    font-size: 14px;
    line-height: 2.4;
  }

  .s-change-personal-avatar form {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    filter: alpha(opacity=0);
    width: 100%;
    height: 100%;
    overflow: hidden;
    cursor: pointer;
  }
  .s-change-personal-avatar form input {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  .s-change-personal-avatar .tips {
    color: #f44;
    font-size: 14px;
    margin-top: 6px;
    display: none;
  }

  .s-change-personal-avatar .progress {
    height: 8px;
    border-radius: 3px;
    background: #d5d5d5;
    width: 100%;
    margin: 26px 0;
    overflow: hidden;
  }

  .s-change-personal-avatar .progress>div {
    background: #4488ee;
    height: 100%;
    border-radius: 3px;
    -webkit-transition: all 0.2s;
    -moz-transition: all 0.2s;
    transition: all 0.2s;
  }

  .s-progress {
    height: 8px;
    border-radius: 3px;
    background: #d5d5d5;
    width: 100%;
    margin: 26px 0;
    overflow: hidden;
  }

  .s-progress>div {
    background: #4488ee;
    height: 100%;
    border-radius: 3px;
    -webkit-transition: all 0.2s;
    -moz-transition: all 0.2s;
    transition: all 0.2s;
  }

  .s-sex-radio .su-radio-group {
    display: inline-flex;
    margin: 0;
  }

  .s-sex-radio .su-radio-group .su-radio {
    margin-left: 20px;
  }
  .s-sex-radio span{
    font-weight: 700;
    font-size: 16px;
    vertical-align: middle;
  }

  @media screen and (max-width: 768px) {
    .s-btn-md {
      padding: 0 30px;
    }

    .s-account-sideCont {
      display: block;
      width: 100%;
    }

    .s-personal-info .avatar {
      display: block;
      margin: 0 auto 25px;
    }

    .s-personal-info table {
      display: block;
      padding-left: 30px;
      width: auto;
      border: none;
    }

    .s-personal-info tr td {
      min-width: 20px;
      overflow: hidden;
      max-width: 180px;
      text-overflow: ellipsis;
    }

    .s-personal-info .modify-info {
      top: 34px;
      right: 88px;
    }

    .s-personal-info .remove-info {
      top: 34px;
      right: 10px;
    }

    .s-dialog-con {
      width: 300px;
    }

    .s-dialog-con .title {
      font-size: 15px;
    }

    .s-change-personal-avatar small {
      color: #999999;
      font-size: 12px;
      line-height: 2.4;
    }
  }

  @media screen and (max-width: 320px) {
    .s-dialog-con {
      width: 260px;
    }
  }
</style>
