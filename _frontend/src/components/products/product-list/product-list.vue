<template lang="pug">
  .product-list
    product-card(
      v-for="prod of items"
      :key="prod.id"
      :product="prod"
      :is-btn="isBtn"
      :is-sizes="isSizes"
    )

</template>

<script>
import ProductCard from '~/components/products/product-card/product-card'
export default {
  name: 'ProductList',
  components: { ProductCard },
  props: {
    items: { type: Array, required: true},
    isBtn: {
      type: Boolean,
      default: false,
      required: false
    },
    isSizes: {
      type: Boolean,
      default: false,
      required: false
    },
  },
  mounted() {
    // console.log('items: ', this.items)
  }
}
</script>

<style lang="scss">
@import 'style';

</style>
