<docs>
## FormView Docs
</docs>

<template>
<div class="sk-form-view" data-com="SkFormView">
  <div ref="form">
    <div class="sk-form-cont">
      <div class="sk-form-cntr"></div>
    </div>
  </div>
</div>
</template>

<script>
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

          _html = '<div class="' + fnCM('sk-form-form') + '">'

          if (_name) _html += _htmlName
          if (_htmlDesc) _html += _htmlDesc

          if (_columns.length > 0) {
            _html += '<form class="' + fnCM('sk-form-form') + '" action="" method="post">'

            for (var _i = 0; _i < _columns.length; _i++) {
              var oColumn = _columns[_i]

              if (oColumn.column_type === 'text') {
                _html += '' +
                      '<div class="' + fnCM('sk-form-form_item') + '">' +
                      '  <div class="' + fnCM('sk-form-form_item_name') + '">' + oColumn.column_name + '</div>' +
                      '  <div class="' + fnCM('sk-form-form_item_desc') + '">' + oColumn.column_desc + '</div>' +
                      '  <div class="' + fnCM('sk-form-form_item_model') + '">' +
                      '    <input class="' + fnCM('sk-form-form_item_text') + '" type="text" name="' + oColumn.id + '" data-required="' + oColumn.column_required + '" />' +
                      '  </div>' +
                      '</div>'
              }

              if (oColumn.column_type === 'textarea') {
                _html += '' +
                      '<div class="' + fnCM('sk-form-form_item') + '">' +
                      '  <div class="' + fnCM('sk-form-form_item_name') + '">' + oColumn.column_name + '</div>' +
                      '  <div class="' + fnCM('sk-form-form_item_desc') + '">' + oColumn.column_desc + '</div>' +
                      '  <div class="' + fnCM('sk-form-form_item_model') + '">' +
                      '    <textarea class="' + fnCM('sk-form-form_item_textarea') + '" type="text" name="' + oColumn.id + '" data-required="' + oColumn.column_required + '" rows="5"></textarea>' +
                      '  </div>' +
                      '</div>'
              }

              if (oColumn.column_type === 'radio') {
                _html += '' +
                      '<div class="' + fnCM('sk-form-form_item') + '">' +
                      '  <div class="' + fnCM('sk-form-form_item_name') + '">' + oColumn.column_name + '</div>' +
                      '  <div class="' + fnCM('sk-form-form_item_desc') + '">' + oColumn.column_desc + '</div>' +
                      '  <div class="' + fnCM('sk-form-form_item_model') + '">'

                let _oConfig = {}

                try {
                  _oConfig = JSON.parse(oColumn.column_config || '{}')
                } catch (err) {}

                if (_oConfig.version === '0.0.1' && _oConfig.values.length > 0) {
                  _oConfig.values.forEach(function (val) {
                    _html += '' +
                              '<label>' +
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
                      '  <div class="' + fnCM('sk-form-form_item_name') + '">' + oColumn.column_name + '</div>' +
                      '  <div class="' + fnCM('sk-form-form_item_desc') + '">' + oColumn.column_desc + '</div>' +
                      '  <div class="' + fnCM('sk-form-form_item_model') + '">'

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
                      '  <div class="' + fnCM('sk-form-form_item_name') + '">' + oColumn.column_name + '</div>' +
                      '  <div class="' + fnCM('sk-form-form_item_desc') + '">' + oColumn.column_desc + '</div>' +
                      '  <div class="' + fnCM('sk-form-form_item_model') + '">'

                let _oConfig = {}

                try {
                  _oConfig = JSON.parse(oColumn.column_config || '{}')
                } catch (err) {}

                if (_oConfig.version === '0.0.1' && _oConfig.values.length > 0) {
                  _oConfig.values.forEach(function (val, index) {
                    _html += '' +
                              '<label>' +
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

            _html += '<div class="' + fnCM('sk-form-form_item_submit_wrap') + '"><button class="' + fnCM('sk-form-form_item_submit') + '" type="submit">提交</button></div>'

            _html += '</form>'
          }

          _html += '<div class="' + fnCM('sk-form-success') + '">' +
                '     <img class="' + fnCM('sk-form-success-img') + '" src="//asset.ibanquan.com/image/5dba55d1718a10002e188622/s.gif" />' +
                '     <div class="' + fnCM('sk-form-success-text') + '">提交成功</div>' +
                '   </div>'

          _html += '</div>'
        }

        return _html
      }

      if (sID) {
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
              window.alert('后台环境提交无效')
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
                    // (eFormSubmitWrap || {}).innerHTML = '<span class="' + fnCM('sk-form-form_done') + '">提交成功</span>'
                  } else {
                    (eFormErrors || {}).innerHTML = '<div class="' + fnCM('sk-form-form_errors_item') + '">提交失败，请稍后再试</div>'
                  }
                }).catch(oError => {
                  (eFormErrors || {}).innerHTML = '<div class="' + fnCM('sk-form-form_errors_item') + '">提交失败，请稍后再试</div>'
                })
              }
            }
          })

          if (window.ElementQueries) {
            window.ElementQueries.init()
          }
        } else {
          window.$($el.querySelector('.' + fnCM('sk-form-cntr'))).html('<div style="text-align: center; padding: 10px 0;">暂无内容</div>')
        }
      } else {
        $el.querySelector('.' + fnCM('sk-form-cont')).setAttribute('data-empty', 'sk-form-form')
        $el.querySelector('.' + fnCM('sk-form-cntr')).innerHTML = ''
      }
    }
  }
}
</script>

<style>
.sk-form-view {
  padding: 60px 0;
  overflow: hidden;
  display: block;
  width: auto;
  background-color: #fff
}
.sk-form-cont {
    box-sizing: border-box;
    margin: 0 auto;
    padding: 0 15px;
    max-width: 600px;
    line-height: 1em;
    font-size: 14px;
}
.sk-form-name {
    margin: 0 0 15px;
    line-height: 1.6em;
    font-size: 28px;
    font-weight: bold;
    text-align: center;
}
.sk-form-desc {
    margin: 0 0 30px;
    line-height: 1.6em;
    font-size: 18px;
    text-align: center;
}
.sk-form-form.i-success .sk-form-form {
  display: none;
}
.sk-form-success {
  display: none;
}
.sk-form-form.i-success .sk-form-success {
  display: block;
}
.sk-form-success-img {
  display: block;
  margin: 0 auto;
  width: 220px;
}
.sk-form-success-text {
  line-height: 1em;
  font-size: 20px;
  text-align: center;
}
.sk-form-form_item {
    margin: 25px 0 0;
}
.sk-form-form_item_name {
    line-height: 1.7em;
    font-size: 16px;
}
.sk-form-form_item_desc {
    margin: 0 0 5px;
    line-height: 1.7em;
    font-size: 14px;
    color: #999;
}
.sk-form-form_item_text {
    box-sizing: border-box;
    width: 100%;
    border: 1px solid #999;
}
.sk-form-form_item_textarea {
    resize: none;
    box-sizing: border-box;
    width: 100%;
    border: 1px solid #999;
    outline: none;
}
.sk-form-form_item_radio_label {
    margin: 0 10px 0 0;
}
.sk-form-form_item_checkbox_label {
    margin: 0 10px 0 0;
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
    margin: 25px 0 0;
    text-align: center;
}
.sk-form-form_item_submit {
    background: none;
    background-color: #fff;
    padding: 8px 20px;
    border-radius: 3px;
    font-size: 14px;
    line-height: 1em;
    outline: none;
    border: 1px solid #999;
}
.sk-form-form_done {
    display: inline-block;
    padding: 0 0 25px;
    font-size: 16px;
    line-height: 32px;
}
</style>
