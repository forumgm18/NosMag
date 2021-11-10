<template lang="pug">
  div
    slot
    .input-phone-form
      input(
        type="text"
        v-mask="'+7 (###) ###-##-##'"
        :value="value"
        placeholder="+7 (___) ___ __ __"
        v-on:input="$emit('input', $event.target.value)"
      )
      .btn-confirm(@click.prevent="submitHandler")
        svg.icon.icon-confirm <use href="#icon-confirm"/>
    slot(name="description")

</template>

<script>
export default {
  name: 'popup-input-form',
  props: ['value'],
  methods: {
    submitHandler() {
      this.$emit('close-popup', false)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'popup-input-form';
</style>
