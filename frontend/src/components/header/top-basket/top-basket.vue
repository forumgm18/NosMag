<template lang="pug">
  nuxt-link.header-basket(:to="`/${cart.alias}`")
    .header-basket-icon
      svg.icon.icon-cart <use href="#icon-cart"/>
      span.header-basket-count
        span {{cart.items_q}}
    span.header-basket-title {{cart.name}}

</template>

<script>
export default {
  name: 'top-basket',
  props: ['cart']
}
</script>

<style lang="scss">
@import 'top-basket';
</style>
