import tabSizes from '~/static/site-settings/size-table-data.json'
import Vue from 'vue'

export const state = () => ({
  tabSizes: tabSizes,
  content: null,

})

export const mutations = {
  setContent (state, content) {
    state.content = content
  },

  setQuantity(state, val) {
    // state.content.data.sizes[val.id].count = val.value
    Vue.set(state.content.data.sizes, val.id, val.value)
  }

}

export const actions = {
  async nuxtServerInit({ dispatch }, {route}) {
    // const path = route.path.split('/')
    // const alias = path[path.length - 1]
    // await dispatch('fetchContent', alias)

    // await dispatch('token/setNewToken')
    // await dispatch('menu/fetch')
  },
  async fetchContent({ state, commit, rootState }, alias) {
    const c = await this.$axios.$get('https://nosmag.ru/api/get_content', {
      params: {
        alias: alias,
        session_id: rootState.token.session_id
      }
    })
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
  setQuantity({state, commit }, val ) {
    const s = state.content.data.sizes[val.id]
    let value = parseInt(val.value.count,10)
    if (value < 0) value = s.count
    if (value > s.ostatok) value = s.ostatok
    val.value.count = value
    commit('setQuantity', val)
  },
}

export const getters = {
  // siteConfig: s => s.siteConfig,
  tabSizes: s => s.tabSizes,
  getContent: s => s.content,
  getContentData: s => s.content.data,
  getPageType: s => s.content.type,

  header: s => s.content.header,
  footer: s => s.content.footer,
  city: s => s.content.header.city,
  phone: s => s.content.header.phone,


}
