import Vue from 'vue'
const calcWidth = el => {
  const inputStyles = window.getComputedStyle(el)
  const l = parseInt(inputStyles.getPropertyValue("border-left-width"))
  const r = parseInt(inputStyles.getPropertyValue("border-right-width"))  
  return el.scrollWidth + l + r
}
Vue.directive('auto-min-width', {
  inserted: el => {el.style.width = calcWidth(el) + 'px'},
  update: el => {el.style.width = calcWidth(el) + 'px'}
})