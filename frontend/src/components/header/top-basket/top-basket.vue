<template lang="pug">
  nuxt-link.header-basket(:to="`/${cart.alias}`")
    .header-basket-icon
      svg.icon.icon-cart <use href="#icon-cart"/>
      span.header-basket-count
        span {{cartCount}}
    span.header-basket-title {{cart.name}}

</template>

<script>
export default {
  name: 'top-basket',
  props: ['cart'],
  computed: {
    cartCount() { 
      // return this.$store.getters['cart/getCartCount']
      return this.cart.items_q
    }
  }
}

</script>

<style lang="scss">
@import 'top-basket';
</style>
