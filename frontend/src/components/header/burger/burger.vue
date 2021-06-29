<template lang="pug">
  .burger(data-burger @click="menuToggle")
    .burger-line-top
      div
      .cross
    .burger-line
    .burger-line
</template>

<script>
import menuFunc from '~/utils/main-scripts'
export default {
  name: 'Burger',
  methods: {
    menuToggle: () => menuFunc.menuToggle(),
  },
}
</script>
<style lang="scss">
@import "burger";
</style>
