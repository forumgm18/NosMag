export const state = () => ({
  settings: null,
  sortmodes: null,
  header: null,
  footer: null,
  status: ''
})

export const mutations = {
  setSettings (state, val) {
    state.settings = val
    state.sortmodes = val.filters.sortmodes
    state.header = val.header
    state.footer = val.footer
    state.status = val.status
  }
}

export const actions = {
  async fetch ({ commit }) {
    // const settings = await this.$axios.$get('https://nosmag.ru/api/get_settings')
    // const settings = await this.$axios.$get('/api/get_settings')
    const settings = await this.$axios.$get('/get_settings')
    console.log('settings: ', settings)
    commit('setSettings', settings)
  }
}

export const getters = {
  // settings: s => s.settings,
  // headerSettings: s => s.header,
  // footerSettings: s => s.footer,
  header: s => s.header,
  footer: s => s.footer,
  sortmodes: s => s.sortmodes,

  city: s => s.header.city,
  phone: s => s.header.phone,
  // info4Users: s => s.header.info,
}
