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
    name: 'register-ok',
    data() {
      return {
        data: {}
      }
    },

    // async fetch() {
    //   this.$store.commit('setBreadcrumbs', [])
    //   const res = await this.$store.dispatch('fetchContent', 'register-ok')
    //   if (res != 'ok') { 
    //     return this.$nuxt.error({ statusCode: 404, message: 'Раздел не найден' })
    //   }
    // },
    // computed: {
    //   pageTitle() { return this.$store.getters['order/getOrderInfo']},
    //   comment() { return this.$store.getters['order/getOrderComment']},
    // }
    async fetch() {
      try {
        this.$store.commit('setBreadcrumbs', [])
        const c = await this.$axios.$get(`/get_content`, {
          params: {
            alias: 'pay-success',
            session_id: this.$store.state.token.session_id
          }
        })
        // return this.$nuxt.error({ statusCode: 404, message: c })
        if (c.status === 'ok' && c.type != '404' && c.type != '505') {
          // Преобразуем строковые числа в числа
          const content = this.$parseJsonStrToNumbers(c)

          // Добавляем полученные данные в data
          // цикл по ключам и значениям
          for (let [key, v] of Object.entries(content.data)) {
            if ( key==='breadcrumbs') { // Коммитим Крошки в $store
              this.$store.commit('setBreadcrumbs', v)
            } else { // Добавляем поле в data
              this.data[key] = v
            }
          }

        } else {
          return this.$nuxt.error({ statusCode: 404, message: 'Страница не найдена' })
        }
      } catch(e) {
        return this.$nuxt.error({ statusCode: 404, message: e })
      }
    },

  }
</script>

<style lang="scss" scoped>
.page-register-order {
  margin-bottom: 3rem;
}
</style>