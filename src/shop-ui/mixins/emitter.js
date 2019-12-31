function fnBroadcast (componentName, evtName, params) {
  this.$children.forEach(vmChild => {
    const _name = vmChild.$options.name

    if (_name === componentName) {
      vmChild.$emit.apply(vmChild, [evtName].concat(params))
    } else {
      fnBroadcast.apply(vmChild, [componentName, evtName].concat([params]))
    }
  })
}

export default {
  methods: {
    dispatch (componentName, evtName, params) {
      let vmParent = this.$parent || this.$root
      let _name = vmParent.$options.name

      while (vmParent && (!_name || _name !== componentName)) {
        vmParent = vmParent.$parent

        if (vmParent) {
          _name = vmParent.$options.name
        }
      }

      if (vmParent) {
        vmParent.$emit.apply(vmParent, [evtName].concat(params))
      }
    },
    broadcast (componentName, evtName, params) {
      fnBroadcast.call(this, componentName, evtName, params)
    }
  }
}
