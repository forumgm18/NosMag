<template lang="pug">
  .site-boby
    app-icons
    app-header
    //- section.container(v-if="breadcrumbs && breadcrumbs.length")
    client-only
      section.container(v-if="breadcrumbs")
        //- v-breadcrumbs(:items="breadcrumbs")
        breadcrumbs(:items="breadcrumbs")
    nuxt
    app-footer
</template>

<script>
// import appIcons from '~/components/common/app-icons'
// import AppHeader from '~/components/header/app-header/app-header'
// import AppFooter from '~/components/footer/app-footer/app-footer'
// import vBreadcrumbs from '~/components/common/breadcrumbs/breadcrumbs'


export default {
  components: {
    // appIcons,
    // vBreadcrumbs,
    // AppHeader,
    // AppFooter,
  },
  // data: () => ({
  //   loading: false
  // }),
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

<style>

</style>
