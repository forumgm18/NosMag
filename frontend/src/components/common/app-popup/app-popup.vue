<template lang="pug">
  .popup(:class="{show: value}")
    .bgr-close.popup-close(@click.stop.prevent="closePopup")
    .popup-body(@click.stop)
      slot
</template>

<script>
  export default {
    // name: 'popup',
    props: ['value'],
    methods: {
      closePopup() {
        // this.value = false
        this.$emit('close-popup', false)
      },
      // handleKeydown(e) {
      //   if (this.isOpen && e.key === "Escape") {
      //   this.closePopup();
      //   }
      // },
    }
  }
</script>

<style lang="scss">
@import "app-popup";
</style>
