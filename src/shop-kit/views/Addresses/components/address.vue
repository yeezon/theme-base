<template>
  <div class="sk-personal-address-table s-personal-address">
    <div v-if="!addresses.length" class="empty-table">
      <p>您还没有添加收货地址</p>
      <su-button type="primary" @click="selectAddress(null, 'new')">
              <i class="s-plus-icon">+</i>新增收货地址</su-button>
    </div>
    <table v-else>
      <thead>
        <tr>
          <th colspan="4">
            <su-button type="primary" @click="selectAddress(null, 'new')">
              <i class="s-plus-icon">+</i>新增收货地址</su-button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="address-item" v-for="(address, index) in addresses" :key="index">
          <td class="shipment" colspan="4">
            <div class="shipment-receiver">
              <span class="name">{{address.name}}</span>
              <span class="phone">{{address.mobile.replace(/(\d{3})\d{4}(\d+)/, '$1****$2')}}</span>
            </div>
            <div class="shipment-address">
              <span class="province">{{address.location_full_titles.split(',')[0]}}</span>
              <span class="city">{{address.location_full_titles.split(',')[1]}}</span>
              <span class="area">{{address.location_full_titles.split(',')[2]}}</span>
              <span class="street">{{address.detail}}</span>
            </div>
          </td>
          <td class="default-address" :class="{'default': address.is_default}"><a href="javascript:void(0);" @click="!address.is_default && selectAddress(address, 'default')">{{address.is_default ? '默认地址' : '设为默认地址'}}</a></td>
          <td class="edit"><a href="javascript:void(0);" @click="selectAddress(address, 'edit')">编辑</a></td>
          <td class="delete"><a href="javascript:void(0);" @click="selectAddress(address, 'delete')">删除</a></td>
        </tr>
      </tbody>
    </table>
    <!-- 新增/编辑地址 -->
    <address-edit :open="editDialog" :address="oEditAddress" :title="oEditAddress && oEditAddress.id ? '编辑地址' : '新增加收货地址'" :is-signed="true" @change="fnEdited" @create="fnEdited" @remove="fnEdited" @close="editDialog = false"></address-edit>

    <!-- 删除 -->
    <su-dialog :open="deleteDialog" @close="deleteDialog = false">
      <div slot="title" class="s-dialog-title">删除收货地址</div>
      <div class="s-dialog-con">
        <p class="tips-text">确定要删除所选收货地址吗？</p>
      </div>
      <div slot="footer">
         <div class="s-ctrl-btns">
          <su-button type="primary" @click="confirmDelete">确定</su-button>
          <su-button type="button" @click="deleteDialog = false">取消</su-button>
        </div>
      </div>
    </su-dialog>
    <!-- 设置默认 -->
    <su-dialog :open="defaultDialog" @close="defaultDialog = false">
      <div slot="title" class="s-dialog-title">设置默认地址</div>
      <div class="s-dialog-con">
        <p class="tips-text">确定要将所选收货地址设为默认吗？</p>
      </div>
      <div slot="footer">
         <div class="s-ctrl-btns">
          <su-button type="primary" @click="confirmSetDefault">确定</su-button>
          <su-button type="button" @click="defaultDialog = false">取消</su-button>
        </div>
      </div>
    </su-dialog>
  </div>
</template>
<script>
import AddressEdit from '../../../components/Address/Edit'

export default {
  components: {
    AddressEdit
  },
  data () {
    return {
      addresses: [],
      oEditAddress: {},
      editDialog: false,
      deleteDialog: false,
      defaultDialog: false,
      oRules: {
        name: [
          { required: true, message: '请输入收货人', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { min: 5, message: '联系电话格式不正确', trigger: 'blur' }
        ],
        district_code: [
          { required: true, message: '请选择地区', trigger: 'change' }
        ],
        detail: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        zipcode: [
          { min: 3, message: '邮政编码格式不正确', trigger: 'blur' }
        ],
        id_card: [
          { min: 15, message: '身份证格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getAddress()
  },
  methods: {
    getAddress: function () {
      this.$sdk.address.get(data => {
        // window.console.log(data);
        this.addresses = data.res.addresses
      })
    },
    // 新增/编辑地址
    selectAddress: function (address, type) {
      if (type === 'default') {
        this.defaultDialog = true
      } else if (type === 'delete') {
        this.deleteDialog = true
      } else if (type === 'edit' || type === 'new') {
        this.editDialog = true
      }
      this.oEditAddress = address || {}
    },
    // 确认设置默认地址
    confirmSetDefault: function () {
      let _address = this.oEditAddress
      _address.is_default = true
      this.$sdk.address.save(_address, data => {
        this.defaultDialog = false
        if (data.res.code === 200) {
          this.getAddress()
        } else {
          this.$confirm({
            title: '提示',
            content: data.res.message
          }).then(() => {
          }).catch(() => {
          })
        }
      })
    },
    // 确认删除地址
    confirmDelete: function () {
      this.$sdk.address.remove({ id: this.oEditAddress.id }, data => {
        if (data.res.code === 200) {
          this.getAddress()
          this.deleteDialog = false
        }
      })
    },
    //
    fnEdited: function (address) {
      this.editDialog = false
      if (!address) return
      this.getAddress()
    }
  }
}
</script>
<style scoped>
.s-plus-icon {
  margin-right: 5px;
}

.sk-personal-address-table {
  padding: 0 30px 30px;
}

.sk-personal-address-table table {
  width: 100%;
}

.sk-personal-address-table table thead {
  text-align: left;
}

.sk-personal-address-table tr {
  height: 60px;
}

.s-personal-address .address-item {
  font-size: 12px;
  text-align: center;
}

.s-personal-address .shipment {
  text-align: left;
}

.s-personal-address .shipment-receiver {
  font-size: 14px;
  font-weight: bold;
  line-height: 2;
  color: #333333;
}

.s-personal-address .shipment span {
  margin-right: 10px;
}

.s-personal-address .shipment-address {
  color: #666;
}

.s-personal-address .address-item a {
  text-decoration: none;
  color: #999;
}

.s-personal-address .address-item .delete {
  width: 56px;
}

.s-personal-address .address-item .default-address {
  width: 100px;
  opacity: 0;
  filter: alpha(opacity=0);
}

.s-personal-address .address-item:hover .default-address,
.s-personal-address .address-item .default-address.default {
  opacity: 1;
  filter: alpha(opacity=100);
}

.s-personal-address .address-item .default-address.default a {
  color: #4488ee;
}

.sk-personal-address-table .empty-table {
  text-align: center;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGkAAABpCAMAAAAOXP0IAAAAM1BMVEUAAADJysrJysrJysrJysrJysrJysrJysrJysrJysrJysrJysrJysrJysrJysrJysrJyspkVnFGAAAAEHRSTlMAECAwQFBgcICPn6+/z9/vIxqCigAAA9RJREFUeAHtWNmO4zgMbB3WIUti/f/X7qCnJ50YJTVlO7tYYOopUCzzZtH8+AsfU/1Civ5tUnLDAS2728XY3AEAUkv6RKkCAOjZ3mpO/f3SzTyfmu23+HqbG10FINxRLguAeotdJgPoYfxA6ACyuW5QByTMnwkC9Ku5EZm+3O54SVABuireXoByIUQNqEb5bAWauSCoLNnfzGlBaeVCOiuqAGE5fc7EKp24VrgX5tiAfV29HfCrQZJTPjcNYpaVO1X0btUVnjtcgbTov47Oju+/GrSKcXeEFb3qx2lU9PtNumxUnZhkQ6m/UIJdus5hx0r5HQ/sfuwSq21fMiG8lvwvpDahSNGyYkMZs4h9WD5miYKm6yjANuo0/sCzXNQG0HPtcw3iDq1H0NS6EmR+PX0JOohKXKmsy/HME3Jj9otlyuryXBD1lyuyMnsJeIMQ7voNwtuEjmEsO5WRBxxzNTlV6hNHQ0VBVPtFJSmxJCN/XJdUR60wYL9b0jaSVP+v3kvDjLgkybLTPhoEPG18/nzl8rteXbkEQtOsjLpRoWki93dYaDus/rFMJm4jyFplqekYUG4z7IgANADcTwRODqsA1wk5Ep+uTyyuA8k8DEpAd/qJhSEPp7AdwB68MT58/jT8ORI9jfvIqgrgi6m58xjaJEldqg1oNblJmbSFL4ALWyC38lnTsV/ZAPX//EuNG9Xe9KFG0ieeXtNti5qJPSPICqp+6+o+byj9xzV01Wl2HvHLC3ldUMaf27umQVjdKoyHt7y8ZR7R+v1htli/7vvTrf6cUf1hiV1aUh10Cz/muoOYs4u3/SnBjcD91ErKy7YpLlVSJi8iIMNWBfxCF6p0POPYXt1rurqAjaCb14Bvc1fnQ9i0BdyOTJOnQTY4lkEAyrlFtAXMLKjtzC6bK9QQZy4IdOGhLNmj9Da+wAy2h1AT8MQxkxkho/D03U9tyQvv0ZPETGzRzP8nJaPbYpA2s2Kz8GvcWh4HHkdlNHgEeW7xBq7MMJ6VrF709UaqRkFeGQhKFQitqroH6Wv6vmgoySfsul59SBUzr7REaV3LP3r+YiTvIXpO1XOywHNaV88JqjmDv1bg9LMPKzIOB+EO1ZMDL1lF+HdE9Yyqp0gyN1vA6udu3dzO30yKmaN+WRKgvxFVxUQKGGXbCkjJakrKsXscruETzX2odXOESBQwsQEtGvWFgswr+XZ4CCf8+9Gx8Rn5dmTsnEVuhwUMn5FvR0Pka/zbkZD4fv92lD+SHODeJeTw/gp5Zz0J6hPVoNc3oeOZME0WvA2SzauNb8PHv41/AI1yRLK1VXsSAAAAAElFTkSuQmCC")
    no-repeat center top;
  padding: 110px 0 48px;
  font-size: 16px;
  color: #999999;
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

/* */
@media screen and (max-width: 768px) {
  .sk-personal-address-table .empty-table {
    padding: 80px 0 48px;
    font-size: 14px;
    background-size: 80px;
  }
  .s-personal-address .address-item {
    display: flex;
    flex-wrap: wrap;
    text-align: left;
    height: auto;
    margin-bottom: 8px;
    border-bottom: 1px solid #ddd;
  }
  .sk-personal-address-table tr {
    padding: 10px 0;
  }

  .sk-personal-address-table table thead a {
    width: 100%;
    margin-bottom: 10px;
  }
  .s-personal-address .shipment {
    width: 100%;
    display: block;
    margin-bottom: 10px;
  }
  .s-personal-address .address-item .default-address {
    width: 100px;
    opacity: 1;
    filter: alpha(opacity=100);
  }
  .s-personal-address .address-item .default-address {
    flex: 1;
  }
  .s-personal-address .address-item .edit {
    flex: 1;
  }
  .s-personal-address .address-item .delete {
    flex: 1;
  }
  .s-dialog-con {
    width: 300px;
  }
  .s-dialog-con .title {
    font-size: 15px;
  }
}

@media screen and (max-width: 320px) {
  .s-dialog-con {
    width: 260px;
  }
}
</style>
