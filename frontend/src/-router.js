import Vue from 'vue'
import Router from 'vue-router'

import RootPage from '~/pages/index'
import Alias from '~/pages/_alias/index.vue'

Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    // mode: 'abstract',
    routes: [
      {
        path: '/',
        component: RootPage
      },
      {
        path: '/:alias',
        component: Alias
      },
    ]
  })
}
