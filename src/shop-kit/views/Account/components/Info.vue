<docs>
## AccountInfo Docs
</docs>

<template>
<div class="account-info" data-com="AccountInfo" @click="fnTo('/account/personal')">
  <div class="s-lite">
    <div class="s-avatar"><img v-show="oCustomer.avatar_url" class="s-img" :src="oCustomer.avatar_url"></div>
    <dir class="s-infos">
      <div class="s-name">{{ oCustomer.name }}</div>
      <div class="s-credit"><SkIcon class="s-icon" name="point" /><span>经验值：{{ oCustomer.total_credit }}</span></div>
    </dir>
  </div>
  <div class="s-items">
    <div class="s-item">积分：{{ oCustomer.point }}</div>
    <div class="s-item">经验值：{{ oCustomer.total_credit }}</div>
    <div class="s-item">会员等级：{{ (oCustomer.customer_level || {}).name }}</div>
  </div>
  <div class="s-sign_out">
    <su-button size="small" @click="fnSignOut">退出账号</su-button>
  </div>
</div>
</template>

<script>
export default {
  componentName: 'AccountInfo',
  data () {
    return {
      err: ''
    }
  },
  computed: {
    oCustomer () {
      return (this.$store.state.account || {}).oInfo || {}
    }
  },
  created () {
    this.getCustomer()
  },
  methods: {
    getCustomer () {
      this.$store.dispatch('getAccountInfo').catch(oError => {
        this.err = '获取数据异常'
      })
    },
    fnTo (path) {
      if (this.$env.isMobi) {
        this.$router.push(path)
      }
    },
    fnSignOut () {
      window.location.href = '/account/logout'
    }
  }
}
</script>

<style scoped>
.account-info {
  padding: 20px;
  background-color: #fff;
  border: 0 solid #ddd;
  border-width: var(--1px);
  border-radius: 3px;
}
.s-lite {
  display: flex;
  align-items: center;
}
.s-avatar {
  overflow: hidden;
  margin: 1px;
  width: 65px;
  height: 65px;
  border: 3px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #d5d5d5;
}
.s-img {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.s-infos {
  flex: 1;
  margin: 0 0 0 15px;
  padding: 0;
  font-size: 14px;
  overflow: hidden;
  color: #999;
}
.s-name {
  color: #666;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
}
.s-credit {
  display: none;
  margin: 5px 0 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
  font-size: 12px;
}
.s-icon {
  display: inline-block;
  margin: 0 5px 0 0;
  font-size: 14px;
}

.s-items {
  margin: 15px 0 0;
}
.s-item {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
  line-height: 1.75em;
  font-size: 13px;
  color: #666;
}

.s-sign_out {
  margin: 25px 0 0;
  text-align: center;
}

@media screen and (max-width: 768px) {
  .account-info {
    padding: 15px;
    border-width: var(--1px) 0;
    border-radius: 0;
  }
  .s-credit {
    display: block;
  }
  .s-items {
    display: none;
  }
  .s-sign_out {
    display: none;
  }
}
</style>
