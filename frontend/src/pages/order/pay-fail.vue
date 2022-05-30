<template lang="pug">
  section.container 
    v-preloader.in-page(v-if="$fetchState.pending")
    template(v-else)
      h1.page-title(v-if="pageTitle") {{pageTitle}}
      .order-info(v-if="content") {{content}}

</template>

<script>
  export default {
    name: 'pay-fail',
    data() {
      return {
        data: {}
      }
    },
    async fetch() {
      try {
        this.$store.commit('setBreadcrumbs', [])
        const c = await this.$axios.$get(`/get_content`, {
          params: {
            alias: 'pay-fail',
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

    computed: {
      content() { return this.data.content},
      pageTitle() { return this.data.title}
    }
  }
</script>

<style lang="scss" scoped>

</style>