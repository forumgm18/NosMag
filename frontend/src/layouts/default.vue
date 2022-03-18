<template lang="pug">
  .site-boby
    //- v-app-icons
    //- v-app-icons(:show-all-icons="true")
    v-app-icons(:show-all-icons="false")
    app-header
    client-only
      section.container(v-if="breadcrumbs && breadcrumbs.length")
        v-breadcrumbs(:items="breadcrumbs")
    nuxt
    app-footer
</template>

<script>

export default {
  computed: {
    breadcrumbs() {return this.$store.getters['getBreadcrumbs'] || null},
    meta() {
      return [
        { hid: 'description1', name: 'description1', content: 'Главная1' }
      ]
    },
  },
}
</script>
<style lang="scss">
// @import '@/assets/scss/global-styles.scss';
</style>