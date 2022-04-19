<template lang="pug">
  span.stars(:data-rating="model" itemprop = "aggregateRating" itemscope itemtype = "https://schema.org/AggregateRating")
    meta(itemprop = "ratingValue" :content="model")
    meta(itemprop="bestRating" content="5")
    svg.icon.icon-star(
      v-for="i in 5" 
      :key="i"
      :class="{active: i <= model}"
      @click="model = i"
      ) <use href="#icon-star"></use>
</template>

<script>
export default {
  name: 'stars',
  props: {
    rating: {
      type: Number,
      default: 0
    },
    value:{ }
  },
  computed: {
    model: {
      get() {return this.value},
      set(v) {
        this.$emit('input', v)
      },
    },

  },
  mounted(){
    this.model = this.rating
  },
  wach: {
    rating(v) { this.model = v}
  }
}
</script>

<style lang="scss" scoped>
  .stars {
    display: inline-flex;
    align-items: center;  
    line-height: 1;
    .icon-star {
      line-height: inherit;
      cursor: pointer;
      color: var(--text-color-light);
      &.active {
        color: var(--base-color2);
      }
    }
  }
</style>
