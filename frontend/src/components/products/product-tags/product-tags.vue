<template lang="pug">
  .product-tags(
    v-if="tags && tags.length"
    :class="{ static: !posAbsolute }"
    )
    .product-tag(v-for="(tag, index) in tags" :key="index") 
      span {{tag.name}}
      svg.icon( :class="tag.icon" ) 
        use(:href="`#${tag.icon}`")

</template>

<script>
  export default {
    props: {
      tags: {
        type: [Array, Object],
        default: null,
        requared: true
      },
      posAbsolute: {
        type: Boolean,
        default: true,
      },

    },
  }
</script>

<style lang="scss" scoped>
@import 'product-tags';
</style>