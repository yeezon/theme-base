<template>
  <div>
    <su-dialog :open="open" :title="'取消订单'" @close="close">
      <div class="s-dialog-con">
        <div class="tips">当前<span>订单取消后将无法恢复</span>，你可以在订单列表中再次购买。</div>
        <h4 class="">请选择取消订单的原因：</h4>
        <div class="s-checkbox-group">
          <form @change="fnChange">
            <label for="cancel_reason1"><span class="radio-btn" :class="selectedIndex == 1 ? 'selected' : ''"></span>商品价格比较贵</label>
            <input type="radio" name="cancel-reason" id="cancel_reason1" data-index="1" data-reason="商品价格比较贵">
            <label for="cancel_reason2"><span class="radio-btn" :class="selectedIndex == 2 ? 'selected' : ''"></span>现在不想购买了</label>
            <input type="radio" name="cancel-reason" id="cancel_reason2" data-index="2" data-reason="现在不想购买了">
            <label for="cancel_reason3"><span class="radio-btn" :class="selectedIndex == 3 ? 'selected' : ''"></span>收货人信息有误</label>
            <input type="radio" name="cancel-reason" id="cancel_reason3" data-index="3" data-reason="收货人信息有误">
            <label for="cancel_reason4"><span class="radio-btn" :class="selectedIndex == 4 ? 'selected' : ''"></span>商品价格波动</label>
            <input type="radio" name="cancel-reason" id="cancel_reason4" data-index="4" data-reason="商品价格波动">
            <label for="cancel_reason5"><span class="radio-btn" :class="selectedIndex == 5 ? 'selected' : ''"></span>送货时间过长</label>
            <input type="radio" name="cancel-reason" id="cancel_reason5" data-index="5" data-reason="送货时间过长">
            <label for="cancel_reason6"><span class="radio-btn" :class="selectedIndex == 6 ? 'selected' : ''"></span>无法支付订单</label>
            <input type="radio" name="cancel-reason" id="cancel_reason6" data-index="6" data-reason="无法支付订单">
            <label for="cancel_reason7"><span class="radio-btn" :class="selectedIndex == 7 ? 'selected' : ''"></span>需修改订单商品</label>
            <input type="radio" name="cancel-reason" id="cancel_reason7" data-index="7" data-reason="需修改订单商品">
            <label for="cancel_reason8"><span class="radio-btn" :class="selectedIndex == 8 ? 'selected' : ''"></span>需修改支付方式</label>
            <input type="radio" name="cancel-reason" id="cancel_reason8" data-index="8" data-reason="需修改支付方式">
            <label for="cancel_reason9"><span class="radio-btn" :class="selectedIndex == 9 ? 'selected' : ''"></span>其他原因</label>
            <input type="radio" name="cancel-reason" id="cancel_reason9" data-index="9" data-reason="其他原因">
          </form>
        </div>
      </div>
      <div slot="footer">
        <div class="s-ctrl-btns">
          <su-button type="primary" @click="fnCancel">取消订单</su-button>
          <su-button @click="close">取消</su-button>
        </div>
      </div>
    </su-dialog>
  </div>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default () {
        return false
      }
    },
    order_no: {
      type: String,
      value: ''
    }
  },
  data () {
    return {
      reason: '',
      selectedIndex: ''
    }
  },
  methods: {
    fnChange (evt) {
      this.reason = evt.target.dataset.reason
      this.selectedIndex = evt.target.dataset.index
    },
    fnCancel () {
      if (!this.reason) {
        this.close()
        return
      }
      const oSend = {
        order_no: this.order_no,
        reason: this.reason
      }
      this.$sdk.order.cancel(oSend, ({ res }) => {
        if (res.code === 200) {
          this.close()
          this.$emit('success')
        } else {
          console.log(res)
        }
      })
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.s-dialog-con {
  width: 510px;
  max-width: 100%;
  margin-bottom: 20px;
}
.tips {
  font-size: 14px;
  color: #333;
}
.tips span {
  color: #f44;
}

.s-checkbox-group {
    font-size: 0
}

.s-checkbox-group label {
    display: inline-block;
    font-size: 14px;
    width: 33.33%;
    line-height: 2;
    color: #666
}

.s-checkbox-group label span {
    margin-right: 6px
}

.radio-btn {
    cursor: pointer;
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplZWFkY2Y1ZS02ZTcxLTAyNDItYmFmZi05OWEyMjg1ODhmNWYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODRDMzBBRDNFNUMwMTFFNThGQTNDRUNEOThFQUIwQzkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODRDMzBBRDJFNUMwMTFFNThGQTNDRUNEOThFQUIwQzkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjZkYTc0ZTctNjU1MC05NjQ1LTk1YjktYjc1OGM3MTMwZjc1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOmVlYWRjZjVlLTZlNzEtMDI0Mi1iYWZmLTk5YTIyODU4OGY1ZiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjaM0wMAAAD7SURBVHjajJI9D0RAFEVnXkXoqEh0+P8/RO+jEzo6QoM9k8nKJuyu280417z73tPHcai35nnu+34cx2VZOLquGwRBHMee552MtoZ935um6bouTVMgUC6xYeY+iqI8z0XEODBs21YURVVV2I6LuOQTABhH80JZlrizLFPfVdc1pHnH1k0l6qcAKBhY85zjOEmSqH9q23ZdVyEWKdUDgQELrbA9+SswYFGPZVqktVjfEwMBSCu2sicGm1aYIrP8XJBv9diRi+/7bAuH3wYAMGATmhlP02RneftvPgHYVbhZvjAM6QQ3pLwun76u9zAMpt8i9ISU0FRyMi8BBgBTedewkS1cFwAAAABJRU5ErkJggg==) no-repeat
}

.radio-btn:hover {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplZWFkY2Y1ZS02ZTcxLTAyNDItYmFmZi05OWEyMjg1ODhmNWYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODRDMzBBRDdFNUMwMTFFNThGQTNDRUNEOThFQUIwQzkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODRDMzBBRDZFNUMwMTFFNThGQTNDRUNEOThFQUIwQzkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjZkYTc0ZTctNjU1MC05NjQ1LTk1YjktYjc1OGM3MTMwZjc1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOmVlYWRjZjVlLTZlNzEtMDI0Mi1iYWZmLTk5YTIyODU4OGY1ZiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmAqIyMAAAFSSURBVHjalJJLSwJRGIbPZUywRQZdECKkFlErEfdtKo3+iNA+/4H7QKjc166WXe0HlBL+AfPSItHBrJjRnHPm9NqUTGE2Pcwsvo/nO5zLS5VS5IuaLs+KvXzJqrclytAkjy34NiNj81N84BD1gSVU5tyIp1vHN52aLnpC4as2BUo0d0+NrmU7JnHs1NHr3qVhfza/geZBztw5fIEGKP7MhakxklwPkN/ZvzKlTbbjAVJpiES6JYet7QYCNMh8aSO1uuxfmdPISCgl435WrFmsUBKxxT9sB2iQ2WNbhoLcywA0yIx4xpLKxylz5rwMNJ7tmQnGnJ15GbiriGhYI+X/XCtkFp7mW1F/NmeOXh4CNMj9QyfXAhXdxlu6cugOG8led8pNCW1I+E5uuw+6wIV0ejbeFeWP8FF3vKtNxPstfy/qT1LjdDbIcMpEpL+TgfMuwAB+/jiOQ2MvBwAAAABJRU5ErkJggg==) no-repeat
}

.radio-btn.selected {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplZWFkY2Y1ZS02ZTcxLTAyNDItYmFmZi05OWEyMjg1ODhmNWYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODRDMzBBREJFNUMwMTFFNThGQTNDRUNEOThFQUIwQzkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODRDMzBBREFFNUMwMTFFNThGQTNDRUNEOThFQUIwQzkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjZkYTc0ZTctNjU1MC05NjQ1LTk1YjktYjc1OGM3MTMwZjc1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOmVlYWRjZjVlLTZlNzEtMDI0Mi1iYWZmLTk5YTIyODU4OGY1ZiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqMh9u8AAAFSSURBVHjalJK7joJQEIblVLJqBZUmSiP4BtKZ+CTWPoBvQs/jaEHPpYJAh5UQaJT9cLLGBDfZnWrmP9+cM5ejdV03+rG6rouiuF6vTdMQ6rpuGMZisZhMJi9Gk4TH45EkSZ7n6/UaCBSRNJLR5/O54zhKqT6DhPv9HgRBFEWkdQND5AgAjLB/IQxDsm3bHv1ucRxD9u9I3VQiB1mWnU6n3dNwCEUHoGBgjefG4/FyuURN0/RwONxut9fFs9nM9/3VaiV3tW2raIsu5djzvHcaI0QUHwxYMQqZCXa5XIbVn89nccCA1ejP1o9I05TkibTdboec67ri0ADdKqlMpOPxSJfvNCGi+NKtYovsUvZtWRYz2e/3X0/DIUSUemTl/1gcK99sNn3ToFVVyS4/9soRgNz44fOZpskkUOhy+Pm04fcuy7Kft1LMhC6hp9Ppi/kWYADcXAh7a3Lb1gAAAABJRU5ErkJggg==) no-repeat
}

.radio-btn.disabled {
    cursor: not-allowed;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplZWFkY2Y1ZS02ZTcxLTAyNDItYmFmZi05OWEyMjg1ODhmNWYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODRDOTRDRUVFNUMwMTFFNThGQTNDRUNEOThFQUIwQzkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODRDOTRDRURFNUMwMTFFNThGQTNDRUNEOThFQUIwQzkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjZkYTc0ZTctNjU1MC05NjQ1LTk1YjktYjc1OGM3MTMwZjc1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOmVlYWRjZjVlLTZlNzEtMDI0Mi1iYWZmLTk5YTIyODU4OGY1ZiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpkOuIIAAAEGSURBVHjajJKxjkZQEIW5kSAUEhUKKlrv/xRKoiEhGhIKQYH9xK5sNn5runvzncyZOSPv+y791DiOdV13XTdNE09d123b9jzPMIyLkU/Btm15nldV5fu+ZVmqqvK5LEvf92VZuq4bRZEQ4lsAnSQJUBAE0l0VRYE4jmM0hyBN03VdP9GXRlGUo8/pGyfSYwFgGFjOsoxGjuNI/1XTNJgX7IQppRcFBizYoKZpbwRgwEJ6XfiRZVmQzjzPbwRsliaCLEnnjWAYBmBBimT5+0BuC+CMXJimybXweBYAgAEfQ4dhiD+yfIgZAOzj8TEc/ywD3zfH9+e827Y99i0EMqaExsnFfAkwAMeVs2w3Hzd0AAAAAElFTkSuQmCC) no-repeat
}

.radio-btn.disabled.selected {
    cursor: not-allowed;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplZWFkY2Y1ZS02ZTcxLTAyNDItYmFmZi05OWEyMjg1ODhmNWYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODRDOTRDRUFFNUMwMTFFNThGQTNDRUNEOThFQUIwQzkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODRDOTRDRTlFNUMwMTFFNThGQTNDRUNEOThFQUIwQzkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjZkYTc0ZTctNjU1MC05NjQ1LTk1YjktYjc1OGM3MTMwZjc1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOmVlYWRjZjVlLTZlNzEtMDI0Mi1iYWZmLTk5YTIyODU4OGY1ZiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pq5UH7oAAAFUSURBVHjalJJBi4JQFIXzZVTkQqigMsiVuWwX+P8J3LVM2iQYLkrQhWhEOl9zZySaGmbu6r7zzvGde49aXdet78rz/Hg8JklSFAXHfr8/HA4tyxoMBg1HE0FVVfv9PoqixWJhmma32wW8XC5pmoZhOJvNlsulUupLAHu73UKybbv1qg6HA+LVaoXmLtjtdrfb7R270ei6zju6+F6v180YQRCcz2f60WgEQwbAqu/78/lc45qHptOpsDebzfV6bT7c6XQ8zxNNHMeYV+yEKeUa8SOb4ggoPTTIig32ej2BxMlTnU4naaBBVq0/F340TVOkU5alQEz5kzcej6VhszyiyJJ0BHIchykf2RwBpc+yDLIiRbKUvA3DYCeTyUT/LBqOgFxBkMj/EVy73XZdV4kT/AH9woYg3l7/fAwHzjLw/eLne/q9SeO+b6WQMSVsGUPqQ4ABAIZT3OzKWuzaAAAAAElFTkSuQmCC) no-repeat
}

input[type=radio],input[type=checkbox] {
    display: none
}

@media screen and (max-width: 768px) {
  .s-checkbox-group label {
    width: 50%;
  }
}
</style>
