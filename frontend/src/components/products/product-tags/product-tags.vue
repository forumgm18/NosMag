<template lang="pug">
  .product-tags(
    v-if="tags && tags.length"
    :class="{ static: !posAbsolute }"
    )
    template(v-for="(tag, index) in tags" ) 
      product-tag(
        v-if="(tag.type ==='sale' && showSaleTag) || tag.type !='sale'"
        :type="tag.type"
        :name="tag.name"
        :key="index"
        )

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

<style lang="scss" scoped >
// @import 'product-tags';
.product-tags {
    display: flex;    
    align-items: center;
    position: absolute;
    top: 10px;
    left: 0;
    z-index: 1;
    &.static {position: static;}
  }

</style>