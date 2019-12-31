<template>
  <div class="sk-products" data-com="SkProducts">
    <div v-if="showFilter && products.length" class="s-nav">
      <ul class="s-sort">
        <li class="sort-list s-mob" v-t="'sort'"></li>
        <li class="sort-list s-border" :class="{selected: tag === ''}" @click="FnSelect('')" v-t="'default'"></li>
        <li class="sort-list s-border" :class="{selected: tag === 'sale_desc'}" @click="FnSelect('sale_desc')" v-t="'sale'"></li>
        <li class="sort-list s-border" :class="{selected: tag === 'price_asc' || tag === 'price_desc'}" @click="FnSelect('price_asc')">
          <span v-t="'price'"></span>
          <span class="s-price-icon" :class="{up: isUp}">↑</span>
        </li>
        <li class="sort-list s-border" :class="{selected: tag === 'date_desc'}" @click="FnSelect('date_desc')" v-t="'time'"></li>
      </ul>
      <su-switch :active-text="$t('stock')" v-model="checked" @input="fnChecked" class="sort-list"></su-switch>
      <div v-if="paging" class="s-filter-page">
        <span class="s-count s-mob" v-t="{ path: 'total', args: { total: paging.items }}"></span>
        <span class="s-current">{{paging.view}}/{{paging.pages}}</span>
        <span class="s-page-btn s-prev" :class="{noselected: paging.view === 1}" @click="Fnprev">&lt;</span>
        <span class="s-page-btn s-next" :class="{noselected: paging.view === paging.pages || paging.pages === 1}"
          @click="Fnnext">></span>
      </div>
    </div>
    <su-items class="s-items" :items="products" :cols="4" :spacing="15" :spacingY="20">
      <template slot-scope="scope" slot="item">
        <s-item :item="scope.item" :show-tag="showTag"></s-item>
      </template>
    </su-items>
  </div>
</template>

<script>
import sItem from '../Product/Item'

export default {
  name: 'SkProducts',
  components: {
    sItem
  },
  props: {
    products: {
      type: Array,
      value () {
        return []
      }
    },
    paging: {
      type: Object,
      value () {
        return {}
      }
    },
    showTag: {
      type: Boolean,
      value: true
    },
    showFilter: {
      type: Boolean,
      value: false
    }
  },
  data () {
    return {
      tag: '',
      checked: false,
      isUp: false,
      current_page: 1,
      query: {
        so: '',
        in_stock: '',
        page: ''
      }
    }
  },
  methods: {
    FnSelect (val) {
      const oTag = this.tag
      this.tag = val
      if (this.tag === 'price_desc' || this.tag === 'price_asc') {
        this.isUp = !this.isUp
        if (this.isUp) {
          this.tag = 'price_desc'
          val = 'price_desc'
        } else {
          this.tag = 'price_asc'
          val = 'price_asc'
        }
        this.current_page = 1
        this.$emit('change', {
          so: val,
          in_stock: this.checked,
          page: this.current_page
        })
      } else {
        if (this.tag === oTag) return
        this.current_page = 1
        this.$emit('change', {
          so: val,
          in_stock: this.checked,
          page: this.current_page
        })
      }
    },
    fnChecked (val) {
      this.current_page = 1
      this.$emit('change', {
        so: this.tag,
        in_stock: this.checked,
        page: this.current_page
      })
    },
    Fnprev () {
      if (this.current_page === 1) {
        return
      }
      if (this.current_page <= this.paging.pages) {
        this.current_page--
        this.$emit('change', {
          so: this.tag,
          in_stock: this.checked,
          page: this.current_page
        })
      }
    },
    Fnnext () {
      if (this.current_page === this.paging.pages) {
        return
      }
      if (this.current_page < this.paging.pages) {
        this.current_page++
        this.$emit('change', {
          so: this.tag,
          in_stock: this.checked,
          page: this.current_page
        })
      }
    }
  }
}
</script>

<style scoped>
  .s-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0 10px;
  }

  .s-sort {
    padding: 0;
    height: 24px;
    display: flex;
    align-items: center;
  }

  .sort-list {
    color: #999;
    list-style: none;
    font-size: 12px;
    margin-right: 10px;
    height: 24px;
    line-height: 24px;
  }

  /* .s-sort li:first-child,
.s-sort li:last-child {
  font-size: 14px;
} */
  .sort-list.s-border {
    cursor: pointer;
    border-color: #ddd;
    border: 1px solid;
    padding: 0 10px;
  }

  .sort-list.selected {
    color: #55aa77;
    border-color: #55aa77;
  }

  .s-price-icon.up {
    transform: rotate(180deg);
    display: inline-block;
  }

  .s-filter-page {
    height: 24px;
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-end;
  }

  .s-count {
    color: #999;
    font-size: 14px;
  }

  .s-current {
    color: #999;
    font-size: 14px;
    margin: 0 20px 0 30px;
  }

  .s-page-btn {
    width: 40px;
    height: 30px;
    text-align: center;
    border-radius: 3px;
    background: #55aa77;
    color: #fff;
    line-height: 30px;
    cursor: pointer;
  }

  .s-page-btn.noselected {
    background: #e0e0e0;
    color: #a3a3a3;
    cursor: not-allowed;
  }

  .s-prev {
    /* background: #e0e0e0;
  color: #a3a3a3; */
  }

  .s-next {
    margin-left: 10px;
  }

  @media screen and (max-width: 768px) {
    .s-nav {
      flex-direction: column;
      align-items: center;
    }

    .s-filter-page {
      height: 48px;
    }
  }

  @media screen and (max-width: 320px) {
    .s-nav {
      padding: 5px;
    }

    .s-filter-page {
      padding: 5px;
    }

    .sort-list.s-border {
      padding: 0 5px;
    }
  }
</style>

<i18n>
{
  "en": {
    "sort": "Sort:",
    "default": "Default",
    "sale": "Sale",
    "price": "Price",
    "time": "Time",
    "total": "{total} items",
    "stock": "Stock"
  },
  "zh-CN": {
    "sort": "排序:",
    "default": "默认",
    "sale": "销量",
    "price": "价格",
    "time": "上架时间",
    "total": "共 {total} 个商品",
    "stock": "仅显示有货"
  }
}
</i18n>
