<template lang="pug">
  nuxt-link.btn.btn-transparent.btn-back(:to="link" @click.prevent="goBack")
    svg.icon <use href="#icon-arrow-back"></use>
    span Назад
</template>

<script>
export default {
  name: 'btn-go-back',
  props: {
    link: {
      type: String,
      default: '#'
    }
    },
  methods: {
    goBack() {
      // console.log('this.$router: ', this.$router)
      // debugger
      if (this.link != '#') {
        this.$router.push(`/${this.link}`)
      } else {
      window.history.length > 2 ?
        this.$router.go(-1) :
        this.$router.push('/')
      }
    }
  }
}
</script>

<style scoped>

</style>
