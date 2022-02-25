<template lang="pug">
  .note
    a.note-body(v-if="link.length" :href="link")
      svg.icon.icon-info <use href="#icon-info"/>
      span.note-text(v-html="`<strong>${noteLabel}</strong> ${note}`") 
    .note-body(v-else)
      svg.icon.icon-info <use href="#icon-info"/>
      span.note-text(v-html="`<strong>${noteLabel}</strong> ${note}`") 
</template>

<script>
  export default {
    props: {
      note: {
        type: String,
        default: ''
      },
      noteLabel: {
        type: String,
        default: 'Примечание'
      },
      link: {
        type: String,
        default: ''
      },
    }  
  }
</script>

<style lang="scss" scoped>
  .note {
    color:var(--text-color-default);
    font-size: .8em;
    &-body{
      color:inherit;
      font-size: inherit;
    }
    &-text{
      font-size: inherit;
      font-weight: normal;
      color:inherit;
      line-height: 1.3;
      }
      .icon {
        margin-right: .25em;
        margin-bottom: .1875em;
      }

  }
</style>