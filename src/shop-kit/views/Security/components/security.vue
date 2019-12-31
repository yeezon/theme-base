<template>
  <div class="sk-security-info">
    <div v-if="!isLoading" class="s-account-sideCont-block s-personal-security">
      <h3>安全设置</h3>
      <div class="s-item" v-if="isSocialType">
        <h5 class="s-label">绑定普通账号</h5>
        <su-button class="s-item_btn" type="primary" @click="fnGoTo('/account/social/sync')">去绑定</su-button>
      </div>
      <div class="s-personal-security-change" v-if="!isSocialType">
        <h5>账号密码<small>（互联网账号存在被盗风险，建议您定期更改密码以保护账户安全）</small>
          <a href="javascript:void(0);" @click="changeDialog = true">
            <su-button type="primary">修改</su-button>
          </a></h5>
      </div>
      <div class="s-personal-security-social" v-if="!isSocialType">
        <h5 style="padding: 0 30px">绑定社交账号<small>（绑定后可无需输入用户名和密码使用社交账号登录）</small></h5>
        <div v-if="$env.isWeApp && socialAccounts.weixin && !socialAccounts.weixin.binded" class="s-bind_tip">请退出当前普通账号，使用社交账号授权登录后，可绑定当前普通账号（手机、邮箱和用户名）。</div>
        <ul v-else>
          <li v-if="socialAccounts.weixin">
            <sk-icon name="wechat" class="security-icon"></sk-icon><span>微信<small>{{socialAccounts.weixin.binded ? socialAccounts.weixin.name || '已绑定' : '未绑定'}}</small></span>
            <su-button :disabled="socialAccounts.weixin.binded" @click="fnBind(socialAccounts.weixin.bind_url)" type="primary">绑定</su-button>
          </li>
          <template v-if="$env.isWeApp">
            <div v-if="!socialAccounts.weixin" class="s-bind_tip">暂无可绑定的社交平台</div>
          </template>
          <template v-else>
            <li v-if="socialAccounts.weibo" class="center">
              <sk-icon name="weibo" class="security-icon"></sk-icon><span>微博<small>{{socialAccounts.weibo.binded ? socialAccounts.weibo.name || '已绑定' : '未绑定'}}</small></span>
              <su-button :disabled="socialAccounts.weibo.binded" @click="fnBind(socialAccounts.weibo.bind_url)" type="primary">绑定</su-button>
            </li>
            <li v-if="socialAccounts.qq">
              <sk-icon name="qq" class="security-icon"></sk-icon><span>QQ<small>{{socialAccounts.qq.binded ? socialAccounts.qq.name || '已绑定' : '未绑定'}}</small></span>
              <su-button :disabled="socialAccounts.qq.binded" @click="fnBind(socialAccounts.qq.bind_url)" type="primary">绑定</su-button>
            </li>
            <li v-if="socialAccounts.netease" class="center">
              <sk-icon name="netease" class="security-icon"></sk-icon><span>网易<small>{{socialAccounts.netease.binded ? socialAccounts.netease.name || '已绑定' : '未绑定'}}</small></span>
              <su-button :disabled="socialAccounts.netease.binded" @click="fnBind(socialAccounts.netease.bind_url)" type="primary">绑定</su-button>
            </li>
            <li v-if="socialAccounts.douban">
              <sk-icon name="douban" class="security-icon"></sk-icon><span>豆瓣<small>{{socialAccounts.douban.binded ? socialAccounts.douban.name || '已绑定' : '未绑定'}}</small></span>
              <su-button :disabled="socialAccounts.douban.binded" @click="fnBind(socialAccounts.douban.bind_url)" type="primary">绑定</su-button>
            </li>
            <li v-if="socialAccounts.renren">
              <sk-icon name="renren" class="security-icon"></sk-icon><span>人人<small>{{socialAccounts.renren.binded ? socialAccounts.renren.name || '已绑定' : '未绑定'}}</small></span>
              <su-button :disabled="socialAccounts.renren.binded" @click="fnBind(socialAccounts.renren.bind_url)" type="primary">绑定</su-button>
            </li>
            <li v-if="socialAccounts.facebook">
              <sk-icon name="facebook" class="security-icon"></sk-icon><span><span class="security-icon-name">Facebook</span><small>{{socialAccounts.facebook.binded ? socialAccounts.facebook.name || '已绑定' : '未绑定'}}</small></span>
              <su-button :disabled="socialAccounts.facebook.binded" @click="fnBind(socialAccounts.facebook.bind_url)" type="primary">绑定</su-button>
            </li>
            <li v-if="socialAccounts.instagram" class="center">
              <sk-icon name="instagram" class="security-icon"></sk-icon><span><span class="security-icon-name">Instagram</span><small>{{socialAccounts.instagram.binded ? socialAccounts.instagram.name || '已绑定' : '未绑定'}}</small></span>
              <su-button :disabled="socialAccounts.instagram.binded" @click="fnBind(socialAccounts.instagram.bind_url)" type="primary">绑定</su-button>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <!-- 修改账号密码 dialog -->
    <su-dialog :open="changeDialog" @close="changeDialog = false">
      <div slot="title" class="s-dialog-title">修改账号密码</div>
      <div class="s-dialog-con">
        <su-form class="s-input-field" :model="password" :rules="rules" ref="password">
          <su-form-item prop="password_old">
            <su-input placeholder="旧密码" type="password" v-model.trim="password.password_old"></su-input>
          </su-form-item>
          <su-form-item prop="password">
            <su-input placeholder="设置新密码" type="password" v-model.trim="password.password"></su-input>
          </su-form-item>
          <su-form-item prop="password_again">
            <su-input placeholder="确认新密码" type="password" v-model.trim="password.password_again"></su-input>
          </su-form-item>
        </su-form>
      </div>
      <div slot="footer">
        <div class="s-ctrl-btns">
          <su-button type="primary" @click="fnModifyPassword">修改账号密码</su-button>
          <su-button type="button" @click="changeDialog = false">取消</su-button>
        </div>
      </div>
    </su-dialog>
  </div>
</template>
<script>
export default {
  data () {
    const validateOldPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'))
      } else if (value.length < 6) {
        callback(new Error('旧密码长度过短，不少于6位'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value.length < 6) {
        callback(new Error('新密码长度过短，不少于6位'))
      } else {
        if (this.password.password_again !== '') {
          this.$refs.password.validateField('password_again')
        }
        callback()
      }
    }
    const validatePasswordAgain = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('确认新密码不能为空'))
      } else if (value !== this.password.password) {
        callback(new Error('两次密码输入不一致!'))
      } else {
        callback()
      }
    }

    return {
      isLoading: false,
      socialAccounts: {},
      isSocialType: false,
      changeDialog: false,
      password: {
        password_old: '',
        password: '',
        password_again: ''
      },
      rules: {
        password_old: [{
          required: true,
          validator: validateOldPassword,
          trigger: 'blur'
        }],
        password: [{
          required: true,
          validator: validatePassword,
          trigger: 'blur'
        }],
        password_again: [{
          required: true,
          validator: validatePasswordAgain,
          trigger: 'blur'
        }]
      }
    }
  },
  created () {
    this.getCustomer()
  },
  methods: {
    fnGoTo (url) {
      this.$router.push(url || '')
    },
    fnBind (url) {
      window.location.href = url || '#'
    },
    // 获取用户信息
    getCustomer () {
      this.isLoading = true

      this.$sdk.account.current(data => {
        this.isLoading = false

        const _oCustomer = data.res.customer || {}
        this.isSocialType = _oCustomer.social_type || false
        if (_oCustomer && _oCustomer.social_accounts.length) {
          const social = _oCustomer.social_accounts || []
          const _socialAccounts = {}
          social.forEach(item => {
            _socialAccounts[item.type] = item
          })
          this.socialAccounts = _socialAccounts
        }
      })
    },
    fnClose () {
      this.changeDialog = false
      this.$refs.password.resetFields()
    },
    //
    fnModifyPassword () {
      this.$refs.password.validate(valid => {
        if (valid) {
          this.$sdk.account.changePassword(this.password, data => {
            if (data.res.code === 200) {
              this.fnClose()
              alert('修改密码成功')
            } else {
              if (data.res.message === '当前密码不正确') {
                this.$refs.password.setFieldTips('password_old', '原密码不正确')
              } else {
                alert(data.res.message || '未知错误')
              }
            }
          })
        }
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
    margin-bottom: 120px;
  }

  .s-account-sideCont-block h3 {
    padding: 30px 30px 20px;
    font-weight: 400;
    font-size: 24px;
    margin: 0;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    margin-bottom: 10px;
    background: #fff;
    border-color: #ddd;
  }

  .s-personal-security {
    border: 1px solid #ddd;
  }

  .s-item {
    display: flex;
    align-items: center;
    padding: 30px;
    border-top-width: 1px;
    border-top-style: solid;
    border-color: #ddd;
    background-color: #fff;
  }
  .s-label {
    flex: 1;
    margin: 0;
    font-size: 16px;
    font-weight: bold;
  }
  .s-item_btn {
    font-size: 12px;
    padding: 0 20px;
    height: 26px;
    line-height: 24px;
  }

  .s-personal-security-change {
    padding: 30px;
    border-top-width: 1px;
    border-top-style: solid;
    border-color: #ddd;
    background-color: #fff;
  }

  .s-personal-security h5 {
    margin: 0;
    font-size: 16px;
    font-weight: bold;
  }

  .s-personal-security h5 button {
    font-size: 12px;
    padding: 0 20px;
    height: 26px;
    line-height: 24px;
  }

  small {
    font-size: 80%;
  }

  .s-personal-security h5 small {
    color: #666;
    font-weight: normal;
  }

  .s-personal-security h5 a {
    float: right;
    font-weight: normal;
  }

  .s-personal-security-social {
    background: #ffffff;
    padding: 30px 0;
    border-top: 1px solid #d5d5d5;
  }

  .s-personal-security-social ul {
        display: flex;
    flex-wrap: wrap;
    padding-left: 0;
    list-style: none;
  }

  .s-personal-security-social ul span {
    font-size: 14px;
    font-weight: bold;
    display: inline-block;
    vertical-align: middle;
    text-align: left;
    padding-left: 10px;
  }

  .s-personal-security-social ul li button {
    font-size: 12px;
    padding: 0 20px;
    height: 26px;
    line-height: 24px;
  }

  .s-personal-security-social ul li {
    padding: 21px 0;
    display: inline-block;
    font-size: 16px;
    width: 33.33%;
    text-align: center;
  }

  /* .s-personal-security-social ul li.center {
    padding: 21px 94px;
  } */

  .s-personal-security-social ul small {
    display: block;
    font-size: 12px;
    width: 84px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 1.8;
    font-weight: normal;
    color: #999;
  }

  .s-personal-security-social ul i {
    font-size: 24px;
    display: inline-block;
    vertical-align: middle;
    width: 52px;
    height: 42px;
    line-height: 42px;
    text-align: center;
  }

  .s-personal-security-social ul .btn {
    margin-left: 10px;
  }

  .s-bind_tip {
    margin: 20px 30px 0;
    font-size: 14px;
    color: #666;
  }

  .security-icon {
    font-size: 24px;
    display: inline-block;
    vertical-align: middle;
    width: 48px;
    height: 28px;
    line-height: 28px;
    text-align: center;
  }

  .s-personal-security-social ul span .security-icon-name {
    font-size: 12px;
    padding: 0;
  }

  .s-btn {
    display: inline-block;
    border-radius: 3px;
    border: 1px solid;
    transition: all 0.3s;
    vertical-align: middle;
    text-decoration: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
  }

  .s-btn:hover,
  .s-btn.active {
    opacity: 0.93;
    filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=93);
  }

  .s-btn:active {
    opacity: 0.85;
    filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=85);
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
    color: #ffffff;
    border-color: #4685ee;
  }

  .s-btn-secondary {
    background: #999999;
    color: #ffffff;
    border-color: #999999;
  }

  .s-btn-vital {
    color: #fff;
    background: #f44;
    border-color: #f44;
  }

  .s-btn-warning {
    color: #fff;
    background: #f71;
    border-color: #f71;
  }

  .s-btn-disabled {
    color: #fff;
    background: #d5d5d5;
    border-color: #d5d5d5;
    cursor: not-allowed;
  }

  .s-btn-default {
    border-color: #666;
    color: #666;
    background: #fff;
  }

  .s-btn-default:hover,
  .s-btn-default.selected {
    color: #4685ee;
    border-color: #4685ee;
  }

  .s-btn-default.selected {
    -webkit-box-shadow: 0 0 0 1px #4685ee;
    box-shadow: 0 0 0 1px #4685ee;
  }

  .s-btn-default.disabled {
    color: #d5d5d5;
    border-color: #d5d5d5;
    cursor: not-allowed;
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

  @media screen and (max-width: 768px) {
    .s-dialog-con {
      width: 300px;
    }

    .s-dialog-con .title {
      font-size: 15px;
    }

    .s-btn-md {
      padding: 0 30px;
    }

    .s-personal-security h5 a {
      /* float: none;
    font-weight: normal;
    display: block; */
      margin-top: 5px;
    }

    .s-personal-security-social ul {
      display: flex;
      flex-wrap: wrap;
    }

    .s-personal-security-social ul li {
      width: 50%;
      padding: 0;
      text-align: center;
      margin-bottom: 30px;
    }

    .s-personal-security-social ul li.center {
      padding: 0;
      text-align: center;
    }

    .security-icon {
      display: block;
      margin: 0 auto 8px;
    }

    .s-personal-security-social ul span {
      display: block;
      margin-bottom: 5px;
      text-align: center;
      padding-left: 0;
    }

    .s-personal-security-social ul small {
      margin: 0 auto;
    }
  }

  @media screen and (max-width: 320px) {
    .s-dialog-con {
      width: 260px;
    }

    .s-ctrl-btns .s-btn {
      margin-right: 10px;
    }
  }
</style>
