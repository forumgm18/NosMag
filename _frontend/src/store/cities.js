export const state = () => ({
  cities: null,
})

export const mutations = {
  setNewCity (state, val) {
    state.cities = val.cities
  },
}

export const actions = {
  async getCities ({ state, commit, rootState }) {
    const city = await this.$axios.$get('/get_cities', {
        params: {
          session_id: rootState.token.session_id
        }
      }
    )
    commit('setNewCity', city)
  },
  async searchCity ({ state, commit, rootState }, searchStr) {
    const cities = await this.$axios.$get('/get_cities', {
        params: {
          session_id: rootState.token.session_id,
          search: searchStr
        }
      }
    )
    commit('setNewCity', cities)
  },
  async setCity ({ dispatch, commit, rootState }, cityId) {
    const res = await this.$axios.$get('/set_city', {
        params: {
          session_id: rootState.token.session_id,
          city_id: cityId
        }
      }
    )
    // console.log('res', res)
    if (res.status === 'ok') {
      // dispatch('settings/fetch', null, { root: true })
      commit('settings/setNewCity', {id: cityId, name:res.city_name}, { root: true })
    } else {
      if (res.error) console.log('Ошибка смены города:', res.error)
    }
    // commit('setCity', settings)
  },

}

export const getters = {
  cities: s => s.cities,
}
