export const back = {
  methods: {
    fnBack () {
      this.$router.back()
    }
  }
}

export const judgesign = {
  created () {
    this.getCustomer()
  },
  methods: {
    getCustomer () {
      this.$store.dispatch('getAccountInfo').catch(oError => {
        this.err = '获取数据异常'
      })
    },
    fnJudgeSign () {
      if (!this.oCustomer.id) {
        this.$sdk.util.setCookie('redirect_back_url', window.location.href)
        this.$router.push(`${window.location.origin}/account/login`)
        return false
      }
    }
  },
  computed: {
    oCustomer () {
      return (this.$store.state.account || {}).oInfo || {}
    }
  }
}

export const postFavor = {
  mixins: [judgesign],
  methods: {
    fnFavor (item) {
      this.fnJudgeSign()
      if (this.oCustomer.id) {
        const _this = this
        window.fetch('/api/v1/post/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            id: item.id
          })
        }).then(function (oRes) {
          return oRes.json()
        }).then(function (oData) {
          if ((oData || {}).code === 200) {
            item.is_favor = true
            item.favor_count++
          } else if ((oData || {}).code === 201) {
            _this.$toast.info((oData || {}).msg.desc)
          }
        }).catch(oError => {
          console.log('失败')
        })
      }
    },
    fnFavorOut (item) {
      const _this = this
      window.fetch(`/api/v1/post/favorites?id=${item.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }).then(function (oRes) {
        return oRes.json()
      }).then(function (oData) {
        if ((oData || {}).code === 200) {
          item.is_favor = false
          item.favor_count--
        } else if ((oData || {}).code === 201) {
          _this.$toast.info((oData || {}).msg.desc)
        }
      }).catch(oError => {
        console.log('取消收藏失败')
      })
    }
  }
}

export const galleryFavor = {
  mixins: [judgesign],
  methods: {
    fnFavor (item) {
      this.fnJudgeSign()
      if (this.oCustomer.id) {
        const _this = this
        window.fetch('/api/v1/image-posts/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            id: item.id
          })
        }).then(function (oRes) {
          return oRes.json()
        }).then(function (oData) {
          if ((oData || {}).code === 200) {
            item.is_favor = true
            item.favor_count++
          } else if ((oData || {}).code === 201) {
            _this.$toast.info((oData || {}).msg.desc)
          }
        }).catch(oError => {
          console.log('失败')
        })
      }
    },
    fnFavorOut (item) {
      const _this = this
      window.fetch(`/api/v1/image-posts/favorites?id=${item.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }).then(function (oRes) {
        return oRes.json()
      }).then(function (oData) {
        if ((oData || {}).code === 200) {
          item.is_favor = false
          item.favor_count--
        } else if ((oData || {}).code === 201) {
          _this.$toast.info((oData || {}).msg.desc)
        }
      }).catch(oError => {
        console.log('取消收藏失败')
      })
    }
  }
}
