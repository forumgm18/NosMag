export const state = () => ({
})

export const mutations = {
  testDeliveryOptions(state, val) {
  // цикл по ключам и значениям
    for (let [key, v] of Object.entries(val)) { state[key] = v }
  },
}

export const actions = {
  async getDeliveryOptions({ commit, rootState}, paramDO) {
    const data = await this.$axios.$get('/get_delivery', {
      params: {
        ...paramDO,
        session_id: rootState.token.session_id
      }
    })
    commit('testDeliveryOptions', data)
  },

}

export const getters = {
  getCity: s => s.city,
  getTarifZone: s => s.tarif_zone,
  getTarifs: s => s.tarifs,
}
