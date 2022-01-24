<template lang="pug">
  .product-tags(
    v-if="tags && tags.length"
    :class="{ static: !posAbsolute }"
    )
    template(v-for="(tag, index) in tags" ) 
      .product-tag(
        v-if="(tag.type ==='sale' && showSaleTag) || tag.type !='sale'"
        :key="index"
        )
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
      showSaleTag: {
        type: Boolean,
        default: false,
        // default: true,
      }

    },
  }
</script>

<style lang="scss" >
@import 'product-tags';
</style>