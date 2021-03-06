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
    // console.log('menu process.env', process.env)
    // const menu = await this.$axios.$get('https://nosmag.ru/api/get_menu')
    // const menu = await this.$axios.$get('/api/get_menu')
    const menu = await this.$axios.$get('/get_menu')
    commit('setMenu', menu.items)
  }
}

export const getters = {
  menuItems: s => s.menuItems
}
