<template lang="pug">
  div
    preloader(v-if="$fetchState.pending")
    //- lazy-page-sublinks(v-else)
    //- lazy-page-razdel(v-else)
    //- LazyNuxtDynamic(v-else :component="componentName")
    component(v-else :is="componentName")
    //- preloader
    //- lazy-page-sublinks
    //- sublinks(v-else)
    
    //- pre-loader.in-page(v-if="$fetchState.pending")
    //- component(v-else :is="componentName" )
</template>

<script>
// import preLoader from '~/components/common/preloader/preloader'

export default {
  // middleware: 'get-route',
  // components: { preLoader },
  async fetch() {
    await this.$store.dispatch('fetchContent', this.$route.params.alias)
    if (this.$route.params.alias === 'cart') await this.$store.dispatch('cart/getCart')

    if (this.$contentError(this.$store.state.content.type)) error({ statusCode: 404, message: '' })
  },

  computed: {
    contentType() {return this.$store.state.content.type || ''},
    componentName() {
      return `lazy-page-${this.contentType}`
      // return `page-${this.contentType}`
    },
    // componentName() {
    //   if (this.contentType.length) {
    //     return () => import(`~/page-components/${this.contentType}`)
    //   } else {
    //     return ''
    //   } 
    // }
  }
}
</script>
