function menuState(state) {
  const burgers = document.querySelectorAll('[data-burger]')
  const header = document.querySelector('[data-header]')
  if (state) {
    document.body.style.top = `-${window.scrollY}px`
    document.body.style.width = `${document.documentElement.clientWidth}px`
    // if (header) header.style.width = `${document.documentElement.clientWidth}px`
    document.body.classList.add('menu-open')

    if (burgers) burgers.forEach((el) => el.classList.add('open'))
  } else {
    const top = document.body.style.top
    document.body.classList.remove('menu-open')
    document.body.style.width = ''
    document.body.style.top = ''
    // if (header) header.style.width=''
    window.scrollTo(0, parseInt(top || '0') * -1)
    if (burgers) burgers.forEach((el) => el.classList.remove('open'))
  }
}
function menuToggle() {
  menuState(!document.body.classList.contains('menu-open'))
}

  // function inRange(n, min, max) {return min <= n && n <= max}
  // function sale(price, oldprice) { return Math.floor((1 - parseInt(price, 10) / parseInt(oldprice, 10)) * 100)}
  // function compareNumeric(a, b) { return a - b }
export function declensionEndings(value, words) {  
  value = Math.abs(value) % 100; 
  let num = value % 10;
  if(value > 10 && value < 20) return words[2]; 
  if(num > 1 && num < 5) return words[1];
  if(num == 1) return words[0]; 
  return words[2];
}
export function contentError(value) {  
    return value === '404' || value === 404
}
export function searchHighlight(searchStr, text) {
        if(!(!!searchStr && !!text)) return text
        return (text.toUpperCase().indexOf(searchStr.toUpperCase()) != -1) ?
          text.replace(new RegExp(searchStr,'ig'),`<strong>$&</strong>`)
        : text
}

export function validatePhone(phone){
  // let regex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/
  let regex = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/
  return regex.test(phone)
}
// export function testLinkExternal(link){
//   return link.includes('http://') || link.includes('https://')
// }
export function linkToInternalFormat(link){
  const lnk = link.trim()
  let httpStr = 'http://'
  let http = lnk.trim().startsWith('http://') || false
  let https = lnk.trim().startsWith('https://') || false
  if (http) return lnk.slice(httpStr.length)
  if (https) return lnk.slice(httpStr.length + 1)
  return lnk
}
export function parseJsonStrToNumbers(val){
  return JSON.parse(JSON.stringify(val), 
          (key, value) => (value === (+value).toString()) ? +value : value )

}
export function getInnerSize(el){
  const elStyles = getComputedStyle(el)
  let paddingW = parseInt(elStyles.paddingLeft) + parseInt(elStyles.paddingRight)
  let paddingH = parseInt(elStyles.paddingTop) + parseInt(elStyles.paddingBottom)
  let w = el.clientWidth - paddingW
  let h = el.clientHeight - paddingH
  return { w, h }
}
export function getNodeElementHeight(node) {
  // in Browser only!
    const list = [
        'margin-top',
        'margin-bottom',
        'border-top',
        'border-bottom',
        'padding-top',
        'padding-bottom',
        'height'
    ]

    const style = window.getComputedStyle(node)
    return list
        .map(k => parseInt(style.getPropertyValue(k), 10))
        .reduce((prev, cur) => prev + cur)
}
export default {
  menuState,
  menuToggle,
  // inRange,
  // sale,
  // compareNumeric,
  // declensionEndings
  // cursorLeave
}
