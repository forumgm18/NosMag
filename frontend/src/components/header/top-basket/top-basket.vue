<template lang="pug">
  nuxt-link.header-link.column.header-basket(:to="`/${cart.alias}`")
    .header-basket-icon
      svg.icon.icon-cart <use href="#icon-cart"/>
      span.header-basket-count
        span {{cartCount}}
    span.header-link_text.header-basket-title {{cart.name}}

</template>

<script>
export default {
  name: 'top-basket',
  props: ['cart'],
  computed: {
    cartCount() { 
      return this.cart.items_q
    }
  }
}

</script>

<style lang="scss">
@import 'top-basket';
</style>
