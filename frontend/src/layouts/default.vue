<template lang="pug">
  .site-boby(:class="pageClass")
    //- v-app-icons
    //- v-app-icons(:show-all-icons="true")
    v-app-icons(:show-all-icons="false")
    app-header
    client-only
      section.container(v-if="breadcrumbs && breadcrumbs.length")
        v-breadcrumbs(:items="breadcrumbs")
    nuxt
    app-footer
    modals-container
</template>

<script>

export default {
  name: 'default-layout',
  computed: {
    breadcrumbs() {return this.$store.getters['getBreadcrumbs'] || null},
    pageClass() { 
      const pathArr = this.$route.path.split('/').reverse()
      return pathArr.length > 1 ? pathArr[1] + '-page' : '' 
    },

  },
}
</script>
<style lang="scss">
</style>