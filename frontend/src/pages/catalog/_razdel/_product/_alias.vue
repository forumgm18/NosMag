<template lang="pug">
  main.container
    section
      v-breadcrumbs(v-if="breadcrumbs"  :items="breadcrumbs")
    section
      h1.page-title {{title}}
    loading.center(v-if="loading")
    section.content-section.product-page(v-else)
      .product-page-


      


  
</template>
<script>
import vLoading from '~/components/common/preloader/preloader'
import vBreadcrumbs from '~/components/common/breadcrumbs/breadcrumbs'

export default {
  components:{
    vLoading,
    vBreadcrumbs,
  },
  data: () => ({
    loading: false,
  }),
  asyncData: async function ({store, params}) {
    // console.log('catalog/_razdel/product/_alias params', params)
    await store.dispatch('fetchContent', params.alias)
  },
  computed: {
    // ...mapGetters('razdel',['products', 'page', 'pageCount']),
    // ...mapGetters('settings',['sortmodes']),
    title() {return this.$store.state.content.data.name || ''},
    // products() { return this.$store.state.content.data.items || null},
    // filters() { return this.$store.state.content.data.filters || null},
    breadcrumbs() {return this.$store.getters['getBreadcrumbs']},
  },


}

</script>

<style lang="scss">
@import "product-page";
</style>
