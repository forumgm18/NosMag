<template lang="pug">
  section.container 
    v-preloader.in-page(v-if="$fetchState.pending")
    template(v-else)
      .page-register-order
        h1.page-title(v-if="pageTitle && pageTitle.length") {{pageTitle}}
        .order-info(v-if="comment && comment.length") {{comment}}

</template>

<script>
  export default {
    async fetch() {
      const res = await this.$store.dispatch('fetchContent', 'register-ok')
      if (res != 'ok') { 
        return this.$nuxt.error({ statusCode: 404, message: 'Раздел не найден' })
      }
    },
    computed: {
      pageTitle() { return this.$store.getters['order/getOrderInfo']},
      comment() { return this.$store.getters['order/getOrderComment']},
    }
  }
</script>

<style lang="scss" scoped>
.page-register-order {
  margin-bottom: 3rem;
}
</style>