export const state = () => ({
  products: []
})

export const mutations = {
  setShowCase (state, showcase) {
    state.products = showcase

  }
}

export const actions = {
  async fetch ({ commit }) {
    // const showcase = await this.$axios.$post('https://nosmag.ru/api/get_showcase', {
    //   type: 'recommend', session_id: 'sdkfsdfjk'
    // })
    // const showcase = await this.$axios.$get('https://nosmag.ru/api/get_showcase', {
    const showcase = await this.$axios.$get('/api/get_showcase', {
      params: {type: 'recommend', session_id: 'sdkfsdfjk'}
    })
    commit('setShowCase', showcase.items)
  }
}

export const getters = {
  products: s => s.products,
  // getProductById: s => id => s.products.find(p => p.id === id) || 9077
  // getProductById: state => id => {
  //   return state.products.find(p => p.id === id);
  // }
}
