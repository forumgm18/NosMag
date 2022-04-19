import Vue from 'vue'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

// Config
const config = {
  themes: {
    header_menu: {
      $extend: 'dropdown',
      triggers: ['click', 'touch'],
      autoHide: true,
      placement: 'bottom-start',
      distance: 0,
      arrowPadding: 0,
      autoMinSize: true,
    },
    tooltip_breadcrumbs: {
      $extend: 'tooltip',
      triggers: ['hover'],
      autoHide: true,
      placement: 'top-start',
    },
  },
}


Vue.use(FloatingVue, config)