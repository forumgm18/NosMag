<template lang="pug">
  .popup(:class="{show: value}")
    .bgr-close.popup-close(@click.prevent="closePopup")
    .popup-body
      slot
</template>

<script>
  export default {
    name: 'popup',
    props: ['value'],
    methods: {
      closePopup() {
        // this.value = false
        this.$emit('close-popup', false)
      }
    }
  }
</script>

<style lang="scss">
@import "popup";
</style>
