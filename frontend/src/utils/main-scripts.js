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

// function cursorLeave(el) {
//
// }

export default {
  menuState,
  menuToggle,
  // cursorLeave
}
