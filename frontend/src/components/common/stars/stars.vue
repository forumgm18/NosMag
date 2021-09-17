<template lang="pug">
  span.stars(:data-rating="rating" itemprop = "aggregateRating" itemscope itemtype = "https://schema.org/AggregateRating")
    meta(itemprop = "ratingValue" :content="rating")
    meta(itemprop="bestRating" content="5")
    svg.icon.icon-star(v-for="i in 5" :class="{active: i <= rating}") <use href="#icon-star"></use>
</template>

<script>
export default {
  name: 'stars',
  props: ['rating']
}
</script>

<style lang="scss" scoped>
  .stars {
    .icon-star {
      cursor: pointer;
      color: var(--text-color-light);
      &.active {
        color: var(--base-color2);
      }
    }
  }
</style>
