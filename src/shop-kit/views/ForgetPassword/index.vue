<template>
  <div>
    <div v-if="!successful" class="s-forget-password-wrap">
      <h2>忘记密码</h2>
      <div class="s-forget-password-con">
        <div class="s-forget-password-title">请输入邮箱或手机号来找回密码</div>
        <!--  -->
        <forget-password-form @success="fnSuccess"></forget-password-form>
      </div>
    </div>
    <!--  -->
    <div v-else class="s-forget-password-wrap">
      <h2>重置密码</h2>
      <div v-if="type === 'email'" class="s-forget-password-succ">
        <div class="s-forget-password-img reset-email-img"></div>
        <div class="s-forget-password-tips">密码重置验证邮件已经发送到您的邮箱，请您点击其中的链接来重置密码！</div>
      </div>
      <div v-if="type === 'mobile'" class="s-forget-password-succ s-mobile-succ">
        <div class="s-forget-password-img reset-mobile-img"></div>
        <h2 class="title">密码已重置成功！</h2>
        <div class="s-forget-password-tips">请使用新的密码登录并愉快地购物吧！</div>
        <su-button type="primary" @click="fnLogin" size="mini">登录</su-button>
      </div>
    </div>
  </div>
</template>

<script>
import ForgetPasswordForm from '../../components/ForgetPassword/Form'

export default {
  name: 'SkForgetPassword',
  components: {
    ForgetPasswordForm
  },
  data () {
    return {
      type: 'mobile',
      successful: false
    }
  },
  methods: {
    fnSuccess (evt) {
      this.type = evt.type
      this.successful = true
    },
    fnLogin () {
      this.$router.push('/account/login')
    }
  }
}
</script>

<style scoped>
  .s-forget-password-wrap {
    width: 90%;
    max-width: 1120px;
    margin: 20px auto;
  }

  .s-forget-password-wrap h2 {
    font-size: 30px;
    margin: 25px 0;
  }

  .s-forget-password-con {
    border-radius: 3px;
    padding: 60px 400px;
    border: 1px solid #dddddd;
    background: #fff;
  }

  .s-forget-password-title {
    margin-bottom: 30px;
    text-align: left;
    font-weight: bold;
  }

  .s-forget-password-succ {
    padding: 120px 280px;
    color: #666666;
    text-align: center;
    border-radius: 3px;
    border: 1px solid #dddddd;
    background: #fff;
  }
  .s-forget-password-succ.s-mobile-succ {
    padding: 60px 400px;
  }

  .s-forget-password-succ h2.title {
    font-size: 24px;
    margin: 0 0 10px 0;
    font-weight: bold;
  }

  .s-forget-password-succ button {
    margin-top: 20px;
    padding: 5px 20px;
  }

  .s-forget-password-succ .s-forget-password-img {
    margin: 0 auto 30px;
  }

  @media screen and (max-width: 768px) {
    .s-forget-password-wrap h2 {
      font-size: 24px;
      margin: 15px 0;
    }

    .s-forget-password-con, .s-forget-password-succ.s-mobile-succ {
      padding: 35px;
    }

    .s-forget-password-succ {
      padding: 50px 25px;
      font-size: 12px;
    }

    .s-forget-password-succ h2.title {
      font-size: 16px;
    }

    .s-forget-password-succ .s-forget-password-img {
      width: 100px;
      height: 48px;
      margin: 0 auto 20px;
    }

    .s-forget-password-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 18px;
    }
  }

  .reset-email-img {
    width: 144px;
    height: 69px;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAABFCAMAAACSa58WAAABKVBMVEUAAACfoKDc3d2foKDJysrc3d2foKDc3d2foKDJysrc3d2foKCfoKCfoKCxsrLc3d2foKDc3d2foKC6u7vc3d2foKCrrKzc3d2foKDJysqfoKCztLS+v7/JysrX2Njc3d2foKC8vb2foKCfoKDJysrc3d2foKCjpKSkpaWlpqanqKipqqqqq6urrKytrq6ur6+xsrKys7OztLS0tLS1tra2t7e3uLi4ubm6u7u9vr6+v7+/wMDBwsLCw8PDxMTHyMjJysrMzMzNzs7P0NDR0dHR0tLV1dXW1tbX19fY2dna29vb29vc3d3d3t7e39/g4ODh4eHi4uLk5eXl5eXl5ubn5+fn6Ojq6urt7e3u7u7v7+/y8vLz8/P19fX29/f4+Pj5+fn8/Pz///8eAbH8AAAAJnRSTlMAEBAgICAwMEBAQFBgcHBwgICPj4+fn5+vr7+/v7+/v8/P3+/v78VISnIAAAKjSURBVHgB7drdUtNAGMbxKiKCKIiigh/ihw8JHyaiFlOhFKhFTbQIQoNFXZ77vwglR53pO51Nurt0nP6v4Dez78FzsCXtRqbnrXV/+rzJS6UczcB+zyf1PbNACCBYs9QygBXghq7nOhAzBpabP60Ue1jcSTaAEU3QAnZJpqvw6jY820D4PUmS15jVBAGKJFUZ2DTOaa0DVXXyD/QRz7RBzGINWGuZ9TQDICbPQQmQF8TYN3xIex78lMVBTEPA4CFtAaFiPyCqCIhMng/ZH4jcBYKWkfNZhh+zfxD3fXgGDqnuYTWlCVB2SNv9ejaBsqIZEFUViFp9nc8aUCNNgcgGEByaOR8zIB758OLC5wOEKc2CeFr8kCIgUjQNyg5pvVXgfAJglzQPImMgaBbYGv4+7YCY+vD28m+NlLZAVCGwlee5IqCqaA9EVvMsksMAaJCWQBqLRDifI9oGaU/bbGuc0jKo57QVpipdgORpK09VRyDGwiIRpqo7kDBthanqDiRMW2FrOAMJ01bYGu5B2bSNe0xVRyBhkQhT1S1ImLbC+bgHCdO2mW0N9yB52kpT1T0oO6QtYao6Acll01aYqg5BwrSt14Xz0QRN3OrR1OUO0NmB1Ik0bSFsDU3QaNKzqQ7QQU2MXalGOWooDg5ITvfJxiZ61XlDZ22pX9TI6VH/b6AhaAgagq4hvDDQ+Nyj7p7i1Sehr38cgF7UhD5gpSb1xQFoLg/o2MUNXRnv7ibetIXOLvCoy7TaEKTR8aCBvg0Y6CQZLFA7yQl6+9tm7R9JXlCQOEkXdBVLgwUqAZ9deGpY0ATNo+IClP39GJ3Q6DawYd/zHhgp3Um0egesVAy2011lCZgslV5q6iuLjn5Yjd17otfjhw+E7k4Xama+u5nsD9pfrFSclpXE96sAAAAASUVORK5CYII=);
  }

  .reset-mobile-img {
    width: 106px;
    height: 95px;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url(data:image/png;base64,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);
  }
</style>
