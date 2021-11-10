<template lang="pug">
  button.btn.btn-secondary
    svg.icon(v-if="(iconId && iconPosition === 'left')" class="iconClass")=`<use href="${iconId}"></use>`
    span(v-if="text") {{text}}
    svg.icon(v-if="(iconId && iconPosition === 'right')" class="iconClass")=`<use href="${iconId}"></use>`
</template>

<script>
export default {
  name: 'BuyBtn',
  props: {
    text: {
      type: String,
    },
    iconId: { type: String },
    iconClass: { type: String },
    iconPosition: {
      type: String,
      default: 'left',
      validator: v => ['left', 'right'].indexOf(v) !== -1
    }
  }

}
</script>

<style scoped>

</style>
