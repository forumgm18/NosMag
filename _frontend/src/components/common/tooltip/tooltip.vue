<template lang="pug">
  .tooltip
    .tooltip-anchor
      slot(name="tooltip-anchor")
        svg.icon.icon-tooltip-anchor <use href="#icon-tooltip-anchor"/>
    .tooltip-close
    .tooltip-body
      .tooltip-title
        slot(name="tooltip-title") 
        
      .tooltip-text 
        slot
      slot(name="tooltip-footer") 
        .tooltip-footer



</template>

<script>
  export default {
    name: 'tool-tip',
  }
</script>

<style lang="scss" scoped>
@import 'tooltip'
</style>
