export const state = () => ({
  tarifs: null
})

export const mutations = {
  setNewOrder(state, val) {
  // цикл по ключам и значениям
    for (let [key, v] of Object.entries(val)) { state[key] = v }
  },
  setOrders(state, val) {
  // цикл по ключам и значениям
    for (let [key, v] of Object.entries(val)) { state[key] = v }
  },
}

export const actions = {
  async newOrder({ commit, rootState}, orderProps) {
    const data = await this.$axios.$post('/new_order', {
        ...orderProps,
        session_id: rootState.token.session_id
    })
    commit('setNewOrder', data)
  },
  async getOrders({ commit, rootState}) {
    const data = await this.$axios.$get('/get_orders', {
      params: {
        session_id: rootState.token.session_id
      }
    })
    commit('setOrders', data)
  },

}

export const getters = {
  // getCity: s => s.city,
}
