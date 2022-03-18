<template lang="pug">
  section.container 
    v-preloader.in-page(v-if="$fetchState.pending")
    template(v-else)
      h1.page-title {{content.title}}
      .order-info {{content.content}}

</template>

<script>
  export default {
    async fetch() {
      const res = await this.$store.dispatch('fetchContent', 'pay-success')
      if (res != 'ok') { 
        return this.$nuxt.error({ statusCode: 404, message: 'Раздел не найден' })
      }
    },
    computed: {
      content() { return this.$store.getters['getContentData']}
    }
  }
</script>

<style lang="scss" scoped>

</style>