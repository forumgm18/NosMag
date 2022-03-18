export const state = () => ({
  menuItems: []
})

export const mutations = {
  setMenu (state, menu) {
    state.menuItems = menu
  }
}

export const actions = {
  async fetch ({ commit }) {
    const menu = await this.$axios.$get('/get_menu')
    commit('setMenu', menu.items)
  }
}

export const getters = {
  menuItems: s => s.menuItems
}
