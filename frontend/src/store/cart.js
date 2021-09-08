export const state = () => ({
  cart: null
})

export const mutations = {
  addToCart(state, value) {},
  removeFromCart(state, value) {},
  clearCart(state) {},
}

export const actions = {
}

export const getters = {
  getCart: s => s.cart,
  cartTotalPrice: (state, getters) => {
    return getters.cartProducts.reduce((total, product) => {
      return total + product.price * product.quantity
    }, 0)
  }


}
