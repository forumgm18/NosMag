export const state = () => ({
  page: 1,
  pageSize: 24,
  products: []
})

export const mutations = {
  setContent(state, content) {
    state.pageSize = content.pageSize || 12
    state.products = content.data
  },
  setPage (state, page) {
    state.page = page
  },

}

export const actions = {
  async fetchContent({ state, commit, rootState }) {
    const items = rootState.content.data.items              // "проксируем" для читабельности кода
    const offsetMin = (state.page-1) * state.pageSize       // стартовая позиция в массиве элементов
    const offsetMax = state.page * state.pageSize           // финишная позиция в массиве элементов
    const items_q = rootState.content.data.items_total_q    // "проксируем" для читабельности кода
    const pageSize = rootState.content.data.items_page_q    // "проксируем" для читабельности кода
    let data = []
    if (items.length > offsetMax || items.length === items_q) { // данные уже есть в $store
      data = items.slice(offsetMin, offsetMax) // для текущей страницы копируем часть массива данных

    } else { // данных нет в $store. Запрашиваем новые.
      // const c = await this.$axios.$get('https://nosmag.ru/api/get_content', {
      const c = await this.$axios.$get('/get_content', {
        params: {
          alias: rootState.content.data.alias,
          limit: state.pageSize,
          offset: (state.page - 1) * state.pageSize,
          session_id: rootState.token.getSessionId
        }
      })
      // Преобразуем "строковые числа" в числа
      if (c) {
        const content = JSON.parse(JSON.stringify(c), (key, value) => (value === (+value).toString()) ? +value : value)
        data = content.data.items
      }
    }
    commit('setContent', { data, pageSize })
  },
}
export const getters = {
  products: s => s.products,
  page: s => +s.page,
  pageSize: s => +s.pageSize,
  pageCount(state, getters, rootState) {
    const pageTotal = rootState.content.data.items_total_q
    const pageSize = rootState.content.data.items_page_q
    return  pageSize > 0 ? Math.ceil(pageTotal / pageSize) : 0
  },
}
