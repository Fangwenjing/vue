const directive = (Vue) => {
  const bind = Vue.util.bind

  Vue.directive('input-line', {
    bind () {
      this.el.classList.add('fg-line')
      let _input = this.el.querySelector('input')
      this.focusHandler = bind(this.onFocus, this)
      this.blurHandler = bind(this.onBlur, this)
      _input.addEventListener('focus', this.focusHandler)
      _input.addEventListener('blur', this.blurHandler)
    },
    onFocus (e) {
      this.el.classList.add('fg-toggled')
    },
    onBlur (e) {
      this.el.classList.remove('fg-toggled')
    }
  })
}

export default directive
