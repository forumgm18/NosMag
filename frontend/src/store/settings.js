export const state = () => ({
  settings: null,
  sortmodes: null,
  header: null,
  footer: null,
  status: '',
  // currency: 'руб.',
  // currencyShort: 'р.',
  currency: '&#8381;',
  currencyShort: '&#8381;',
  imgPath: '/images/catalog/',
  imgPrefix: { l: 'l_', m: 'm_', s: 's_', t: 't_'},
  imgRetinaPrefix: 'x2_',
  yandexApiKey: null,

})

export const mutations = {
  setSettings (state, val) {
    state.settings = val
    state.sortmodes = val.filters.sortmodes
    state.header = val.header
    state.footer = val.footer
    state.status = val.status,
    state.yandexApiKey = val.yandex_api_key
  },
  setNewCity (state, val) {
    state.header.city = val
  },
}

export const actions = {
  async fetch ({ commit, rootState }) {
    // console.log('settings/fetch', rootState.token.session_id)
    const settings = await this.$axios.$get('/get_settings', {
      params: {
        session_id: rootState.token.session_id
      }

    })
    commit('setSettings', settings)
  },
}

export const getters = {
  // settings: s => s.settings,
  // settings: s => s.settings.filters.sortmodes,
  header: s => s.header,
  footer: s => s.footer,
  sortmodes: s => s.sortmodes,
  // sortmodes: s => s => s.settings.filters.sortmodes,

  city: s => s.header.city,
  phone: s => s.header.phone,
  currency: s => s.currency,
  currencyShort: s => s.currencyShort,
  imgPath: s => s.imgPath,
  imgPrefix: s => s.imgPrefix,
  imgRetinaPrefix: s => s.imgRetinaPrefix,
  yandexApiKey: s => s.yandexApiKey,
  userDefaultCity: s => s.header.city || undefined,

}
