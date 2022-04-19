import {parseJsonStrToNumbers} from '@/utils/main-scripts'
import Vue from 'vue'
export const state = () => ({
  // content: null,
})

export const mutations = {
  setStatus (state, val) {
    state.status = val
  },
  setType (state, val) {
    state.Type = val
  },
  setContent (state, val) {
    console.log('setContent Root', val)

    // state.status = val.status
    // state.type = val.type
    Vue.set(state, 'status', val.status)
    Vue.set(state, 'type', val.type)
  // цикл по ключам и значениям
    for (let [key, v] of Object.entries(val.data)) {
      // state[key] = v 
      Vue.set(state, key, v)
    }
    console.log('setContent Root state', state)
  },
  setBreadcrumbs (state, val) {
    state.breadcrumbs = val
  },

}

export const actions = {
  // async nuxtServerInit({ commit, state, dispatch }, { app, store, route, req, res, error, redirect }) {
  async nuxtServerInit({ commit, dispatch }, { app }) {
    const sid = 'session_id'
    let sidv = app.$cookiz.get(sid, {path: '/'})
    // console.log('session_id: ', sidv)
    if (sidv === undefined || sidv === null || sidv === 'undefined' || sidv === 'null') sidv = app.$generateUUID()
    commit('token/setSID', sidv)
    app.$cookiz.set(sid, sidv, { maxAge: 365 * 24 * 60 * 60 })

    await dispatch('menu/fetch')
    await dispatch('settings/fetch')
    await dispatch('cart/getCart')

  },

  async fetchContent({ commit, rootState }, queryParams) {
    const qParams = typeof queryParams === 'string' ? {alias: queryParams} : queryParams
    const c = await this.$axios.$get(`/get_content`, {
      params: {
        ...qParams,
        session_id: rootState.token.session_id
      }
    })
    console.log('c',c)

    // Преобразуем строковые числа в числа
    const content = parseJsonStrToNumbers(c)


    if (content.type === 'catalog') {
      if (content.data.sizes) content.data.sizes.forEach(el => el.count = 0)
    }

    commit('setContent', content)
    return c.status ? c.status : 'error'
  },
}

export const getters = {
  getPageType: s => s.type || null,
  getStatus: s => s.status || null,
  getTitle: s => s.title || null,
  getPageTitle: s => s.name || null,
  getBreadcrumbs: s => s.breadcrumbs || null,
  getShowcase: s => s.showcase || null,
  getFeedbacks: s => s.feedbacks || null,
  getLinks: s => s.links || null,
  getLinks1: s => s.links1 || null,
  getSublinks: s => s.sublinks || null,
  getSublinksMenu: s => s.sublinks_menu || null,
  getContent: s => s.content || null,


}
