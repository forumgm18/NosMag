export const state = () => ({
  // items: null,        //  массив с данными о товарах в корзине
  // oldsum: null,       //	int	может отсутств	старая (зачеркн) сумма цен
  // sum: 0,             //	int		сумма товаров в корзине
  // comment: '',        //	string		комментарий к заказу
  // order_allow: null   //  =0 оформление запрещено,=1 оформление разрешено
})

export const mutations = {
  SET_CART(state, val) {
  // цикл по ключам и значениям
    for (let [key, v] of Object.entries(val)) {
      state[key] = v 
    }
  },
  ADD_TO_CART(state, val) {
      // [items] => Array
      //                 (
      //                     [0] => Array
      //                         (
      //                             [scode] => 210330000008
      //                             [q] => 1
      //                         )
      //                 )
      val.forEach(v => {
        const st = state.items.find(s => s.scode === v.scode)
        if (st) { 
          st.q = v.q
        } else {
          state.items.push(v)
        }
      })
      
  },
  CHANGE_CART(state, value) {},
  REMOVE_FROM_CART(state, value) {},
  CLEAR_CART(state) {},
}

export const actions = {
  async getCart({ state, commit, rootState}) {
    const cart = await this.$axios.$get('/get_cart', {
        params: {
          session_id: rootState.token.session_id
        }
      }
    )
    if (cart.status ==='ok') commit('SET_CART', cart)

  },
  async addToCart({ state, commit, rootState}, val) {
    let v = Array.isArray(val) ? val : [val] 
    console.log('v: ', v)
    debugger
    const cart = await this.$axios.$post('/add_cart', {
          session_id: rootState.token.session_id,
          items: v
      }
    )
    // if (cart.status ==='ok') dispatch('getCart')
    if (cart.status ==='ok') {
      console.log('Добавлено в корзину', val)
      commit('ADD_TO_CART', v)
    } else {
      console.log('Ошибка добавления в корзину', val)
    }

  },
  async changeCart({ state, commit, rootState}, val) {
    let v = Array.isArray(val) ? val : [].push(val) 
    const cart = await this.$axios.$get('/chg_cart', {
        params: {
          session_id: rootState.token.session_id,
          items: v
        }
      }
    )
    if (cart.status ==='ok') {
      console.log('Изменено в корзине', val)
      commit('CHANGE_CART', v)
    } else {
      console.log('Ошибка Изменеия корзины', val)
    }

  },
  async delCart({ state, commit, rootState}, val) {
    let v = Array.isArray(val) ? val : [].push(val) 
    const cart = await this.$axios.$get('/del_cart', {
        params: {
          session_id: rootState.token.session_id,
          items: v
        }
      }
    )
    if (cart.status ==='ok') {
      console.log('Удалено из корзины', val)
      commit('REMOVE_FROM_CART', v)
    } else {
      console.log('Ошибка Удаления из корзины', val)
    }
  },

}

export const getters = {
  getCart: s => s.cart,
  cartTotalPrice: (state, getters) => {
    return getters.cartProducts.reduce((total, product) => {
      return total + product.price * product.quantity
    }, 0)
  }


}