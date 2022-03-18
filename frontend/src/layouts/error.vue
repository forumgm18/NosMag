<template lang="pug">
  .err404-block.container
    .err404-img
    .err404-text
      .err404-title 404
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