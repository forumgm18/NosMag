<template lang="pug">
  .product-tag( 
    v-if="type && type.length && name && name.length"
    :style="{ color: textColor, backgroundColor: bgrColor }"
    )
    span {{name}}
    svg.icon(:class="getIcon" ) 
      use(:href="`#${getIcon}`")

</template>

<script>
  export default {
    props: {
      type: {
        type: String,
        default: null,
        requared: true
      },
      name: {
        type: String,
        default: null,
        requared: true
      },
      bgrColor: {
        type: String,
        default: 'var(--product-tag-bgr)'
      },
      textColor: {
        type: String,
        default: '#fff'
      }

    },
    computed: {
      getIcon() {
        switch(this.type) {
          case 'new': 
            return 'icon-tag-new'
          case 'hit': 
            return 'icon-tag-fire'
          case 'sale': 
            return 'icon-tag-percent'
        }
        return false
      }
    }
  }
</script>

<style lang="scss" scoped>
// @import 'product-tag';
.product-tag {
    display: flex;
    align-items: center;
    justify-content: center;
    // background-color: var(--product-tag-bgr);
    // color: #fff;
    line-height: 1;
    padding: .444444em .777777em;
    min-width: 4.3333em;
    font-style: italic;
    font-weight: bold;
    font-size: 9px;
    line-height: 1;
    letter-spacing: -0.02em;
    text-transform: uppercase;    
    &:not(:last-child){  margin-right: .4em;}

    span {
      display: block;
      font: inherit;
      color: inherit;
      line-height: inherit;
      margin-right: .3333em;
      // text-transform: uppercase;
    }
    svg {
      display: block;
      font-size: inherit;
      color: inherit;
    }

  }



</style>