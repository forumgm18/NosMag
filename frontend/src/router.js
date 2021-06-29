import Vue from 'vue'
import Router from 'vue-router'

import RootPage from '~/pages/index'
// import Catalog from '~/pages/catalog/index'

Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '*',
        component: RootPage
      },
      // {
      //   path: '/catalog',
      //   component:
      // },
    ]
  })
}
