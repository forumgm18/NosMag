import Vue from 'vue'
const calcWidth = el => {
  // el.style.width = null
  el.style.width = 0 + 'px'
  const inputStyles = window.getComputedStyle(el)
  const l = parseInt(inputStyles.getPropertyValue("border-left-width"))
  const r = parseInt(inputStyles.getPropertyValue("border-right-width"))  
  return el.scrollWidth + l + r
}
Vue.directive('auto-min-width', {
  bind(el, binding) {
    el.dataset.autoWidth = binding.value
    // console.log('bind', !!el.dataset.autoWidth)

  },
  inserted: el => {
    // el.style.width = calcWidth(el) + 'px'
    // debugger
    // console.log('inserted', !!el.dataset.autoWidth)
    el.style.width = !!el.dataset.autoWidth ? calcWidth(el) + 'px' : null
  },
  update: el => {
    // el.style.width = calcWidth(el) + 'px'
    // debugger
    // console.log('update', !!el.dataset.autoWidth)
    el.style.width = !!el.dataset.autoWidth ? calcWidth(el) + 'px' : null
  },
})