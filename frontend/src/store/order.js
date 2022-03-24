export const state = () => ({
  order: null
})

export const mutations = {
  setNewOrder(state, val) {
    // state.order = val
  // цикл по ключам и значениям
    for (let [key, v] of Object.entries(val)) { state[key] = v }
    // console.log('newOrder state', state)
  },
  setOrders(state, val) {
  // цикл по ключам и значениям
    for (let [key, v] of Object.entries(val)) { state[key] = v }
  },
}

export const actions = {
  async newOrder({ commit, rootState }, orderProps) {
    const data = await this.$axios.$post('/new_order', {
        ...orderProps,
        session_id: rootState.token.session_id
    })
    commit('setNewOrder', data)
    // if (data.prepay && data.prepay.formUrl && data.prepay.formUrl.length) redirect(data.prepay.formUrl)
    return data.status
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
  getNewOrder: s => s,
  getPrepay: s => s.prepay || null,
  getPrepayFormUrl: s => s.prepay && s.prepay.formUrl ? s.prepay.formUrl : null,
  getPrepayOrderId: s => s.prepay && s.prepay.orderId ? s.prepay.orderId : null,
  getOrderId: s => s.order_id || null,
  getOrderComment: s => s.comment || null,
  getOrderInfo: s => s.info || null,
}
