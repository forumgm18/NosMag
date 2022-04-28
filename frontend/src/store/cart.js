import Vue from 'vue'
export const state = () => ({
})

export const mutations = {
  SET_CART(state, val) {
    // цикл по ключам и значениям
    for (let [key, v] of Object.entries(val.cart)) {
      state[key] = v 
      // Vue.set(state, key, v)
      // this.$set(state, key, v)
    }
    if (state.oform && state.oform.prices) {
      state.oform.prices = state.oform.prices.map(v => {
        let vv = parseFloat(v.value)
        if (vv) {
          v.value = vv.toLocaleString() + ' ' + val.rootState.settings.currencyShort
        } else { 
          v.value = 'Бесплатно'
        }
        return v
      })
    } 
  },
  // ADD_TO_CART(state, val) {
  ADD_TO_CART(state, val) {
    // val.rootCart.items_q = val.items_q  
    val.rootState.settings.header.cart.items_q = val.items_q  
  },
  CHANGE_CART(state, value) {},
  REMOVE_FROM_CART(state, val) {
    val.rootCart.items_q = val.items_q  
  },
  CLEAR_CART(state, val) {
    val.settings.header.cart.items_q = 0  
  },
}

export const actions = {
  async getCart({ state, commit, rootState}, paramsCart) {
    const cart = await this.$axios.$get('/get_cart', {
        params: {
          ...paramsCart,
          session_id: rootState.token.session_id
        }
      }
    )
    // console.log('cart: ', cart.cart.items)
    if (cart.status ==='ok') commit('SET_CART', {cart, rootState})
  },
  async addToCart({ state, commit, rootState}, val) {
    let v = Array.isArray(val) ? val : [val] 
    console.log('v: ', v)
    // debugger
    const cart = await this.$axios.$post('/add_cart', {
          session_id: rootState.token.session_id,
          items: v
      }
    )
    // debugger
    // if (cart.status ==='ok') dispatch('getCart')
    if (cart.status ==='ok') {
      console.log('Добавлено в корзину', val)
      commit('ADD_TO_CART', {items_q: parseInt(cart.items_q, 10), rootState })
    } else {
      console.log('Ошибка добавления в корзину', val)
    }
    return cart.status
  },
  async changeCartItem({ state, commit, rootState}, val) {
    let v = []
    if (Array.isArray(val)) {v = val} else {v.push(val)}
    const cart = await this.$axios.$post('/chg_cart', {
          session_id: rootState.token.session_id,
          items: v
      }
    )
    if (cart.status ==='ok') {
      console.log('Изменено в корзине', val)
      commit('CHANGE_CART', v)
    } else {
      console.log('Ошибка Изменеия корзины', val)
    }

  },
  async delCartItem({ state, commit, rootState}, val) {
    let v = []
    if (Array.isArray(val)) {v = val} else {v.push(val)}
    const cart = await this.$axios.$post('/del_cart', {
          session_id: rootState.token.session_id,
          items: v
      }
    )
    if (cart.status ==='ok') {
      console.log('Удалено из корзины', val)
      commit('REMOVE_FROM_CART', {items_q: parseInt(cart.items_q, 10), rootCart:rootState.settings.header.cart })
    } else {
      console.log('Ошибка Удаления из корзины', val)
    }
  },

}

export const getters = {
  getCart: (s) => s.cart || null,
  getCartCount: s => s.cart && s.cart.items_q ? s.cart.items_q : 0,
  getOform: (s) => s.oform || null,
  getPromo: (s) => s.promo || null,
  // getCartAvailable: s => s.cart.map(item => item.active),
  cartTotalPrice: (state, getters) => {
    return getters.cartProducts.reduce((total, product) => {
      return total + product.price * product.quantity
    }, 0)
  },
}
