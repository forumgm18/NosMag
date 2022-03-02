export const state = () => ({
  // tarifs: null
})

export const mutations = {
  setDeliveryOptions(state, val) {
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
    commit('setDeliveryOptions', data)
    console.log('getDeliveryStatus: ', data.status)
    return data.status || undefined
  },
  async setDeliveryType({ rootState }, deliveryType) {
    const c = await this.$axios.$post('/set_delivery_type', {
      	delivery_type: deliveryType,
        session_id: rootState.token.session_id
    })
    // commit('setDeliveryOptions', data)
    console.log('setDeliveryStatus: ', c.status)
    return c.status || undefined
  },

}

export const getters = {
  getCity: s => s.city || null,
  getTarifZone: s => s.tarif_zone || null,
  getTarifs: s => s.delivery || null,
}
