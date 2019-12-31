<template>
  <div class="s-email-success-wrap">
    <h2>注册成功</h2>
    <div class="s-email-success-con">
      <div class="s-register-sucess-img"></div>
      <div class="s-register-success-title">恭喜 {{email}} 已注册成功！</div>
      <div class="s-register-success-tips">
        <div class="title">验证注册邮箱</div>
        <div class="desc">验证邮件已发送到您的注册邮箱，请验证后再
          <a href="/account/login">登录</a>。
        </div>
        <div class="title">没有收到验证邮件怎么办？</div>
        <div class="desc">检查上面的注册邮箱是否正确，错了可以
          <a href="/account/register">重新注册</a>；
          <br>检查是否在注册邮箱的垃圾箱里。
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkEmailRegister',
  props: {
    email: {
      type: String,
      value: ''
    }
  }
}
</script>

<style scoped>
/* 邮箱注册 */
.s-email-success-wrap {
  width: 90%;
  max-width: 1120px;
  margin: 20px auto;
}

.s-email-success-wrap h2 {
  font-size: 30px;
  margin: 25px 0;
}

.s-email-success-con {
  border-radius: 3px;
  padding: 60px 300px;
  border: 1px solid #dddddd;
  text-align: center;
  background: #fff;
}

.s-register-success-title {
  font-size: 24px;
  margin-bottom: 16px;
}

.s-register-success-tips {
  /* width: 480px; */
  margin: 50px auto 0;
  font-size: 12px;
  text-align: left;
  color: #999999;
  line-height: 1.5;
}

.s-register-success-tips .title {
  font-size: 16px;
  font-weight: bold;
  color: #333333;
  margin-top: 20px;
}

.s-register-success-tips a {
  color: #4488ee;
  text-decoration: none;
}

.s-register-sucess-img {
  width: 130px;
  height: 113px;
  margin: 0 auto 30px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(data:image/png;base64,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);
}

@media screen and (max-width: 768px) {
  .s-email-success-wrap h2 {
    font-size: 24px;
    margin: 15px 0;
  }

  .s-email-success-con {
    padding: 25px;
  }

  .s-register-sucess-img {
    width: 90px;
    height: 78px;
  }

  .s-register-success-title {
    font-size: 16px;
    font-weight: bold;
  }

  .s-register-success-tips {
    margin: 30px auto 0;
  }

  .s-register-success-tips .title {
    font-size: 14px;
    margin-top: 10px;
  }
}
</style>
