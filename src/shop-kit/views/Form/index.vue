<docs>
## FormView Docs
</docs>

<template>
<div class="sk-form-view" data-com="SkFormView">
  <div class="sk-form-box i-loading" ref="form">
    <div class="sk-form-cont">
      <div class="sk-form-cntr"></div>
    </div>
  </div>
</div>
</template>

<script>
import closeImg from '@/shop-kit/views/Form/assets/close.png'
import successImg from '@/shop-kit/views/Form/assets/success.gif' // '//asset.ibanquan.com/image/5dba55d1718a10002e188622/s.gif'

export default {
  name: 'SkFormView',
  data () {
    return {
      handle: this.$route.params.handle || '',
      oForm: {}
    }
  },
  watch: {
    oForm () {
      this.fnRender()
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.getForm()
    },
    getForm () {
      window.fetch('/api/v1/site_form/' + this.handle, {
        method: 'GET',
        credentials: 'include'
      }).then(oRes => {
        return oRes.json()
      }).then(oData => {
        if ((oData || {}).code === 200) {
          this.oForm = {
            'site_form': oData.site_form || {},
            'site_form_columns': oData.site_form_columns || {}
          }
        } else {
          this.oForm = {}
        }
      }).catch(oError => {
        this.oForm = {}
      })
    },
    fnRender () {
      const fnCM = (_class) => {
        return _class
      }

      var fnCheckURL = (url) => {
        return /^(https?:)?\/\/([\w-]+\.)+[\w-]+(\/[\w-+_;./?%&=#:,{}()]*)?$/ig.test(url)
      }

      const $el = this.$refs.form
      const sID = this.handle || ''
      const oFormConfigData = this.oForm || {}

      var html = ''
      var isEditor = !!window.oRef
      var formBuildErr = ''

      var fnFormBuilder = function (oData) {
        var _html = ''

        oData = oData || {}
        oData.site_form = oData.site_form || {}
        oData.site_form_columns = oData.site_form_columns || []

        if (oData.site_form.name) {
          var _name = oData.site_form.name || ''
          var _desc = oData.site_form.describe || ''
          var _columns = oData.site_form_columns || []

          var _htmlName = '<h1 class="' + fnCM('sk-form-name') + '">' + _name + '</h1>'
          var _htmlDesc = '<div class="' + fnCM('sk-form-desc') + '">' + _desc + '</div>'

          _html = '<div class="' + fnCM('sk-form-form_box') + '">'

          if (_name) _html += _htmlName
          if (_desc) _html += _htmlDesc

          if (_columns.length > 0) {
            _html += '<form class="' + fnCM('sk-form-form') + '" action="" method="post">'

            for (var _i = 0; _i < _columns.length; _i++) {
              var oColumn = _columns[_i]

              if (oColumn.column_type === 'text') {
                _html += '' +
                      '<div class="' + fnCM('sk-form-form_item') + '">' +
                      '  <div class="' + fnCM('sk-form-form_item_name') + '">' + oColumn.column_name + '</div>'

                if (oColumn.column_desc) {
                  if (fnCheckURL(oColumn.column_desc)) {
                    _html += '<img class="' + fnCM('sk-form-form_item_desc-img') + '" src="' + oColumn.column_desc + '" alt="' + oColumn.column_name + '" />'
                  } else {
                    _html += '<div class="' + fnCM('sk-form-form_item_desc') + '">' + oColumn.column_desc + '</div>'
                  }
                }

                _html += '' +
                      '  <div class="' + fnCM('sk-form-form_item_model') + '">' +
                      '    <input class="' + fnCM('sk-form-form_item_text') + '" type="text" name="' + oColumn.id + '" data-required="' + oColumn.column_required + '" placeholder="请输入" />' +
                      '  </div>' +
                      '</div>'
              }

              if (oColumn.column_type === 'textarea') {
                _html += '' +
                      '<div class="' + fnCM('sk-form-form_item') + '">' +
                      '  <div class="' + fnCM('sk-form-form_item_name') + '">' + oColumn.column_name + '</div>'

                if (oColumn.column_desc) {
                  if (fnCheckURL(oColumn.column_desc)) {
                    _html += '<img class="' + fnCM('sk-form-form_item_desc-img') + '" src="' + oColumn.column_desc + '" alt="' + oColumn.column_name + '" />'
                  } else {
                    _html += '<div class="' + fnCM('sk-form-form_item_desc') + '">' + oColumn.column_desc + '</div>'
                  }
                }

                _html += '' +
                      '  <div class="' + fnCM('sk-form-form_item_model') + '">' +
                      '    <textarea class="' + fnCM('sk-form-form_item_textarea') + '" type="text" name="' + oColumn.id + '" data-required="' + oColumn.column_required + '" rows="5" placeholder="请输入"></textarea>' +
                      '  </div>' +
                      '</div>'
              }

              if (oColumn.column_type === 'radio') {
                _html += '' +
                      '<div class="' + fnCM('sk-form-form_item') + '">' +
                      '  <div class="' + fnCM('sk-form-form_item_name') + '">' + oColumn.column_name + '</div>'

                if (oColumn.column_desc) {
                  if (fnCheckURL(oColumn.column_desc)) {
                    _html += '<img class="' + fnCM('sk-form-form_item_desc-img') + '" src="' + oColumn.column_desc + '" alt="' + oColumn.column_name + '" />'
                  } else {
                    _html += '<div class="' + fnCM('sk-form-form_item_desc') + '">' + oColumn.column_desc + '</div>'
                  }
                }

                _html += '' +
                      '  <div class="' + fnCM('sk-form-form_item_model') + '">'

                let _oConfig = {}

                try {
                  _oConfig = JSON.parse(oColumn.column_config || '{}')
                } catch (err) {}

                if (_oConfig.version === '0.0.1' && _oConfig.values.length > 0) {
                  _oConfig.values.forEach(function (val) {
                    _html += '' +
                              '<label class="' + fnCM('sk-form-form_item_model-label') + '">' +
                              '  <input class="' + fnCM('sk-form-form_item_radio') + '" type="radio" name="' + oColumn.id + '" value="' + val + '" data-required="' + oColumn.column_required + '" />' +
                              '  <span class="' + fnCM('sk-form-form_item_radio_label') + '">' + val + '</span>' +
                              '</label>'
                  })
                } else {
                  formBuildErr = '数据版本不匹配'

                  _html += '数据版本不匹配'
                }

                _html += '' +
                      '  </div>' +
                      '</div>'
              }

              if (oColumn.column_type === 'select') {
                _html += '' +
                      '<div class="' + fnCM('sk-form-form_item') + '">' +
                      '  <div class="' + fnCM('sk-form-form_item_name') + '">' + oColumn.column_name + '</div>'

                if (oColumn.column_desc) {
                  if (fnCheckURL(oColumn.column_desc)) {
                    _html += '<img class="' + fnCM('sk-form-form_item_desc-img') + '" src="' + oColumn.column_desc + '" alt="' + oColumn.column_name + '" />'
                  } else {
                    _html += '<div class="' + fnCM('sk-form-form_item_desc') + '">' + oColumn.column_desc + '</div>'
                  }
                }

                _html += '<div class="' + fnCM('sk-form-form_item_model') + '">'

                let _oConfig = {}

                try {
                  _oConfig = JSON.parse(oColumn.column_config || '{}')
                } catch (err) {}

                if (_oConfig.version === '0.0.1' && _oConfig.values.length > 0) {
                  _html += '<select class="' + fnCM('sk-form-form_item_select') + '" name="' + oColumn.id + '" data-required="' + oColumn.column_required + '">'

                  _oConfig.values.forEach(function (val) {
                    _html += '<option value="' + val + '">' + val + '</option>'
                  })

                  _html += '</select>'
                } else {
                  formBuildErr = '数据版本不匹配'

                  _html += '数据版本不匹配'
                }

                _html += '' +
                      '  </div>' +
                      '</div>'
              }

              if (oColumn.column_type === 'checkbox') {
                _html += '' +
                      '<div class="' + fnCM('sk-form-form_item') + '">' +
                      '  <div class="' + fnCM('sk-form-form_item_name') + '">' + oColumn.column_name + '</div>'

                if (oColumn.column_desc) {
                  if (fnCheckURL(oColumn.column_desc)) {
                    _html += '<img class="' + fnCM('sk-form-form_item_desc-img') + '" src="' + oColumn.column_desc + '" alt="' + oColumn.column_name + '" />'
                  } else {
                    _html += '<div class="' + fnCM('sk-form-form_item_desc') + '">' + oColumn.column_desc + '</div>'
                  }
                }

                _html += '<div class="' + fnCM('sk-form-form_item_model') + '">'

                let _oConfig = {}

                try {
                  _oConfig = JSON.parse(oColumn.column_config || '{}')
                } catch (err) {}

                if (_oConfig.version === '0.0.1' && _oConfig.values.length > 0) {
                  _oConfig.values.forEach(function (val, index) {
                    _html += '' +
                              '<label class="' + fnCM('sk-form-form_item_model-label') + '">' +
                              '  <input class="' + fnCM('sk-form-form_item_checkbox') + '" type="checkbox" name="' + oColumn.id + '[' + index + ']' + '" value="' + val + '" data-required="' + oColumn.column_required + '" />' +
                              '  <span class="' + fnCM('sk-form-form_item_checkbox_label') + '">' + val + '</span>' +
                              '</label>'
                  })
                } else {
                  formBuildErr = '数据版本不匹配'

                  _html += '数据版本不匹配'
                }

                _html += '' +
                      '  </div>' +
                      '</div>'
              }
            }

            _html += '<div class="' + fnCM('sk-form-form_errors') + '"></div>'

            _html += '<div class="' + fnCM('sk-form-form_item_submit_wrap') + '"><button class="' + fnCM('sk-form-form_item_submit') + '" style="background-color: ' + ((oFormConfigData.site_form || {}).button_background_color || '#3975f9') + ';" type="submit">' + ((oFormConfigData.site_form || {}).button_text || '提交') + '</button></div>'

            _html += '</form>'
          }

          _html += '<div class="' + fnCM('sk-form-success') + '">' +
                '     <img class="' + fnCM('sk-form-success_img') + '" src="' + successImg + '" />' +
                '     <div class="' + fnCM('sk-form-success_text') + '">操作成功</div>' +
                '   </div>'

          _html += '</div>'
        }

        return _html
      }

      if (sID && /^(0|1)$/ig.test((oFormConfigData.site_form || {}).status)) {
        html = fnFormBuilder(oFormConfigData)

        $el.querySelector('.' + fnCM('sk-form-cont')).removeAttribute('data-empty')

        if (html) {
          window.$($el.querySelector('.' + fnCM('sk-form-cntr'))).html(html)
          var eForm = $el.querySelector('.' + fnCM('sk-form-form'))

          eForm.addEventListener('submit', function (evt) {
            evt.stopPropagation()
            evt.preventDefault()

            if (formBuildErr) {
              window.alert(formBuildErr)

              return
            }

            if (isEditor) {
              window.alert('后台环境操作无效')
            } else {
              var eTarget = evt.target
              var oSendData = {}
              var errors = []
              var _htmlErr = ''

              var _serializeArray = window.$(eTarget).serializeArray() || []
              var oSetData = {}

              var _arrIndex = 0
              var _oItem = {}
              for (_arrIndex = 0; _arrIndex < _serializeArray.length; _arrIndex++) {
                _oItem = _serializeArray[_arrIndex]
                oSetData[_oItem.name] = _oItem.value || ''
              }

              // 以 site_form_columns 数据项为准
              (oFormConfigData.site_form_columns || []).forEach(function (oColumn) {
                if (oColumn.column_type === 'checkbox') {
                  var _values = []
                  var _val = ''

                  var _key = ''
                  for (_key in oSetData) {
                    if (_key.indexOf(oColumn.id) > -1) {
                      _val = oSetData[_key] || ''

                      if (_val) {
                        _values.push(_val)
                      }
                    }
                  }

                  if (oColumn.column_required && !(_values.length > 0)) {
                    errors.push('请填写：' + oColumn.column_name)
                  }

                  oSendData[oColumn.id] = _values
                } else {
                  _val = oSetData[oColumn.id] || ''

                  if (oColumn.column_required && !_val) {
                    errors.push('请填写：' + oColumn.column_name)
                  }

                  oSendData[oColumn.id] = _val
                }
              })

              var eFormErrors = $el.querySelector('.' + fnCM('sk-form-form_errors'))
              // var eFormSubmitWrap = $el.querySelector('.' + fnCM('sk-form-form_item_submit_wrap'))

              if (errors.length > 0) {
                errors.forEach(function (err) {
                  _htmlErr += '<div class="' + fnCM('sk-form-form_errors_item') + '">' + err + '</div>'
                });

                (eFormErrors || {}).innerHTML = _htmlErr
              } else {
                (eFormErrors || {}).innerHTML = ''

                // checkbox 数组值转换成 String
                var _sendKey = ''
                for (_sendKey in oSendData) {
                  if (Array.isArray(oSendData[_sendKey])) {
                    // oSendData[_sendKey] = JSON.stringify(oSendData[_sendKey])
                    oSendData[_sendKey] = (oSendData[_sendKey] || []).join()
                  }
                }

                if ((oFormConfigData.site_form || {}).status === 0) {
                  window.alert('表单为发布状态时才能提交数据')
                } else {
                  window.fetch('/api/v1/site_form/create_collection/' + sID || null, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                      data: oSendData
                    })
                  }).then(function (oRes) {
                    return oRes.json()
                  }).then(function (oData) {
                    if ((oData || {}).code === 200) {
                      eForm.classList.add('i-success')
                      // (eFormSubmitWrap || {}).innerHTML = '<span class="' + fnCM('sk-form-form_done') + '">操作成功</span>'
                    } else {
                      (eFormErrors || {}).innerHTML = '<div class="' + fnCM('sk-form-form_errors_item') + '">操作失败，请稍后再试</div>'
                    }
                  }).catch(oError => {
                    (eFormErrors || {}).innerHTML = '<div class="' + fnCM('sk-form-form_errors_item') + '">操作失败，请稍后再试</div>'
                  })
                }
              }
            }
          })

          if (window.ElementQueries) {
            window.ElementQueries.init()
          }
        } else {
          window.$($el.querySelector('.' + fnCM('sk-form-cntr'))).html('<div style="text-align: center; padding: 10px 0;">暂无内容</div>')
        }
      } else if ('site_form' in oFormConfigData) {
        $el.classList.add('i-close')

        $el.querySelector('.' + fnCM('sk-form-cntr')).innerHTML = '' +
          '<div class="sk-form-close">' +
          '  <img class="sk-form-close_img" src="' + closeImg + '" alt="close_img">' +
          '  <div class="sk-form-close_text">您所访问的表单已停止收集</div>' +
          '</div>'
      } else {
        // $el.querySelector('.' + fnCM('sk-form-cont')).setAttribute('data-empty', 'form')
        $el.querySelector('.' + fnCM('sk-form-cntr')).innerHTML = '<div style="text-align: center; line-height: 1em;">暂无此表单</div>'
      }

      $el.classList.remove('i-loading')
    }
  }
}
</script>

<style>
.sk-form-box {
  box-sizing: border-box;
  margin: 80px auto;
  padding: 50px 0 60px;
  overflow: hidden;
  display: block;
  width: auto;
  max-width: 900px;
  border: 1px solid #d5d5d5;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
}
.sk-form-box.i-loading,
.sk-form-box.i-close {
  border: none;
  background: none;
}
.sk-form-cont {
  margin: 0 auto;
  padding: 0 15px;
  max-width: 700px;
  line-height: 1em;
  font-size: 14px;
}
.sk-form-close {
  margin: 40px 0 50px;
}
.sk-form-close_img {
  display: block;
  margin: 0 auto;
  width: 100%;
  max-width: 280px;
}
.sk-form-close_text {
  margin: 36px 0 0;
  line-height: 1em;
  font-size: 28px;
  text-align: center;
  color: #777;
  font-weight: normal;
}
.sk-form-success {
  display: none;
}
.sk-form-form.i-success ~ .sk-form-success {
  display: block;
}
.sk-form-success_img {
  display: block;
  margin: 0 auto;
  width: 160px;
}
.sk-form-success_text {
  line-height: 1em;
  font-size: 20px;
  text-align: center;
}
.sk-form-name {
  margin: 0;
  line-height: 1.6em;
  font-size: 26px;
  text-align: center;
}
.sk-form-desc {
  margin: 4px 0 0;
  line-height: 1.6em;
  font-size: 16px;
  text-align: center;
  color: #999;
}
.sk-form-form {
  margin: 50px 0 0;
}
.sk-form-form.i-success {
  display: none;
}
.sk-form-form_item {
  margin: 40px 0 0;
}
.sk-form-form_item_name {
  margin: 0 0 4px;
  line-height: 1.7em;
  font-weight: bold;
}
.sk-form-form_item_desc {
  margin: 0 0 4px;
  line-height: 1.7em;
  color: #b2b2b2;
}
.sk-form-form_item_desc-img {
  display: block;
  margin: 10px 0 0;
  max-width: 100%;
}
.sk-form-form_item_model {
  margin: 18px 0 0;
}
.sk-form-form_item_model-label {
  display: flex;
  align-items: center;
  overflow: hidden;
  margin: 11px 0 0;
  padding: 0 2px;
  line-height: 1.7em;
  white-space: normal;
  word-break: break-all;
}
.sk-form-form_item_text {
  display: block;
  box-sizing: border-box;
  padding: 3px 10px;
  width: 100%;
  border: 1px solid #bfbfbf;
  border-radius: 3px;
  font-size: 14px;
  line-height: 1.8em;
  outline: none;
}
.sk-form-form_item_textarea {
  display: block;
  resize: none;
  box-sizing: border-box;
  padding: 4px 10px;
  width: 100%;
  border: 1px solid #bfbfbf;
  border-radius: 3px;
  font-size: 14px;
  line-height: 1.8em;
  outline: none;
}
.sk-form-form_item_select {
  display: inline-block;
  box-sizing: border-box;
  appearance: none;
  margin: 0;
  padding: 3px 26px 3px 10px;
  min-width: 180px;
  max-width: 100%;
  border: 1px solid #bfbfbf;
  border-radius: 3px;
  line-height: 1.7em;
  font-size: 14px;
  background-color: #fff;
  color: #6b6b6b;
  outline: none;
  background-repeat: no-repeat;
  background-position: center right 9px;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAFCAQAAADWbbXjAAAAGklEQVR42mNg+I8FMjBgE0IXRgJYhGDCUAAAtRYd48XEOp8AAAAASUVORK5CYII=")
}
.sk-form-form_item_radio_label {
  display: inline-block;
  margin: 0 10px 0 8px;
}
.sk-form-form_item_checkbox_label {
  display: inline-block;
  margin: 0 10px 0 8px;
}
.sk-form-form_errors {
  margin: 25px 0 0;
}
.sk-form-form_errors_item {
  font-size: 14px;
  line-height: 1.6em;
  color: #f65;
}
.sk-form-form_item_submit_wrap {
  margin: 60px 0 0;
  text-align: center;
}
.sk-form-form_item_submit {
  box-sizing: border-box;
  background: none;
  /* background-color: #3975f9; */
  padding: 10px 20px;
  min-width: 142px;
  max-width: 100%;
  border-radius: 3px;
  font-size: 15px;
  line-height: 1.6em;
  outline: none;
  border: none;
  color: #fff;
}
.sk-form-form_done {
  display: inline-block;
  padding: 0 0 25px;
  font-size: 16px;
  line-height: 32px;
}

@media screen and (max-width: 750px) {
  .sk-form-box {
    margin: 30px 16px 50px;
    padding: 0;
    border: none;
    background: none;
  }
  .sk-form-cont {
    padding: 0;
  }
  .sk-form-close {
    margin: 50px 0;
  }
  .sk-form-close_img {
    max-width: 190px;
  }
  .sk-form-close_text {
    margin: 20px 0 0;
    font-size: 15px;
  }
  .sk-form-success {
    margin: 16px 0 0;
    padding: 16px 16px 46px;
    border-radius: 4px;
    background-color: #fff;
  }
  .sk-form-name {
    font-size: 24px;
  }
  .sk-form-desc {
    font-size: 15px;
  }
  .sk-form-form {
    margin: 25px 0 0;
  }
  .sk-form-form_item {
    margin: 16px 0 0;
    padding: 16px 16px 20px;
    border-radius: 4px;
    background-color: #fff;
  }
  .sk-form-form_item_name {
    margin: 0 0 1px;
    font-size: 18px;
  }
  .sk-form-form_item_desc {
    margin: 0;
  }
  .sk-form-form_item_desc-img {
    margin: 10px 0;
  }
  .sk-form-form_item_model {
    margin: 13px 0 0;
  }
  .sk-form-form_item_model-label {
    margin: 0 -16px 0 0;
    padding: 15px 2px;
    border: 0 solid #ededed;
    border-width: 1px 0 0;
  }
  .sk-form-form_item_model-label:last-child {
    padding: 15px 2px 0;
  }
  .sk-form-form_item_select {
    width: 100%;
    line-height: 2.6em;
  }
  .sk-form-form_item_text {
    box-sizing: border-box;
    margin: 0 -16px 0 0;
    padding: 15px 16px 0 0;
    width: calc(100% + 16px);
    border: 0 solid #ededed;
    border-width: 1px 0 0;
    border-radius: 0;
  }
  .sk-form-form_item_textarea {
    box-sizing: border-box;
    margin: 0 -16px 0 0;
    padding: 15px 16px 0 0;
    width: calc(100% + 16px);
    height: calc(1.8em * 3 + 16px);
    border: 0 solid #ededed;
    border-width: 1px 0 0;
    border-radius: 0;
  }
  .sk-form-form_item_submit_wrap {
    margin: 40px 0 0;
  }
  .sk-form-form_item_submit {
    box-sizing: border-box;
    padding: 15px 20px;
    width: 100%;
    border-radius: 4px;
    font-size: 16px;
  }
}
</style>
