<template lang="pug">
  section.container 
    v-preloader.in-page(v-if="$fetchState.pending")
    template(v-else)
      h1.page-title(v-if="pageTitle") {{pageTitle}}
      .order-info(v-if="content") {{content}}

</template>

<script>
  export default {
    async fetch() {
      const res = await this.$store.dispatch('fetchContent', 'pay-fail')
      if (res != 'ok') { 
        return this.$nuxt.error({ statusCode: 404, message: 'Раздел не найден' })
      }
    },
    computed: {
      content() { return this.$store.getters['getContent']},
      pageTitle() { return this.$store.getters['getTitle']}
    }
  }
</script>

<style lang="scss" scoped>

</style>