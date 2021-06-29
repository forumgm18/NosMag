<template lang="pug">
  .product-list
    product-item(
      v-for="prod of items"
      :key="prod.id"
      :product="prod"
      :is-btn="isBtn"
      :is-sizes="isSizes"
    )

</template>

<script>
import ProductItem from '~/components/products/product-item'
export default {
  name: 'ProductList',
  components: { ProductItem },
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

<style scoped>

</style>
