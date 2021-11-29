export const state = () => ({
  content: null,
})

export const mutations = {
  setContent (state, content) {
    state.content = content
  },
}

export const actions = {
  // async nuxtServerInit({ dispatch }, {params}) {
  //   // await dispatch('fetchContent', params.alias)
  //   // await dispatch('token/setNewToken')
  //   await dispatch('menu/fetch')
  //   await dispatch('settings/fetch')

  // },
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

  async fetchContent({ state, commit, rootState }, alias) {
    const c = await this.$axios.$get(`/get_content`, {
      params: {
        alias: alias,
        session_id: rootState.token.session_id
      }
    })
    console.log('c',c)

    // Преобразуем строковые числа в числа
    const content = JSON.parse(JSON.stringify(c),function (key, value) {
      if (value === (+value).toString()) return +value
      return value
    } )

    if (content.type === 'catalog') {
      if (content.data.sizes) content.data.sizes.forEach(el => el.count = 0)
    }

    commit('setContent', content)
  },
}

export const getters = {
  // siteConfig: s => s.siteConfig,
  getContent: s => s.content,
  getContentData: s => s.content.data,
  getBreadcrumbs: s => {
    if (!s || !s.content || !s.content.data) return null
    return  s.content.data.hasOwnProperty('breadcrumbs') ? s.content.data.breadcrumbs : null},
  getPageType: s => s.content.type,

}
