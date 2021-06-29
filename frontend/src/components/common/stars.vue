<template lang="pug">
  span.stars(:data-rating="rating")
    svg.icon.icon-star(v-for="i in 5" ) <use href="#icon-star"></use>
</template>

<script>
export default {
  name: 'stars',
  props: ['rating']
}
</script>

<style scoped>

</style>
