<template lang="pug">
  .err404-block.container
    .err404-img
    .err404-text
      .err404-title {{error.statusCode}}
      p {{error.message}}
      p Проверьте правильность написания адреса или перейдите в каталог
      nuxt-link.btn.btn-secondary(to="/") На главную
</template>
<script>
export default {
  props: {
    error: {}
  }
}
</script>
<style lang="scss" scoped>
  .err404{
    &-block {
    padding-top: 3rem;
    padding-bottom: 5rem;
      .btn {
        margin-top: 2rem;
        max-width: 360px;
      }
    }
    &-title{
      font-size: 5rem;
      font-weight: 700;
      margin-bottom: 2rem;
    }
    &-text{
      p {
        margin-bottom: 1rem;
      }
    }
  }
</style>