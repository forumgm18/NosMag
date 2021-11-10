<template lang="pug">
  nuxt-link.header-basket(:to="`/${cart.alias}`")
    .header-basket-icon
      svg.icon.icon-basket <use href="#icon-basket"/>
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
