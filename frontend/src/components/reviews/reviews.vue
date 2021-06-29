<template lang="pug">
  section.reviews
    .reviews-title
      span Отзывы
      span.rating.average(v-if="feedbacks.length")
        span.average-point
          span {{reviewsRating}}
          span /5
        stars(:rating="reviewsRating")
        span.average-total {{feedbacks.length}}
    review-item(v-for="(f, i) in feedbacks" :key="f.id" :review="f" v-if="( i < reviewsMax)")
    .reviews-footer(v-if="feedbacks.length")
      a(href="#" @click.prevent="showReviewsToggle") {{showReviewsText}}
      a(href="#") Написать отзыв
    .reviews-footer.not-reviews(v-else)
      span Отзывов пока нет. Вы можете первым
      a(href="#") оставить отзыв


</template>

<script>
import stars from '~/components/common/stars'
import ReviewItem from '~/components/reviews/review-item'

export default {
  name: 'reviews',
  components: {stars, ReviewItem },
  props: {
    feedbacks: {
      type: Array,
      required: true
    },
    reviewsShowDefault: {
      type: Number,
      default: 2
    }
    },
  data: () => ({
    reviewsMax: 0,
  }),
  computed: {
    reviewsRating() {
      const r = this.feedbacks
      if (r && r.length === 0) return 0
      const sum = r.reduce((s, item) => s + parseInt(item.stars,10), 0)
      return Math.floor(sum / r.length)
    },
    showReviewsText() {
      return this.showReviewsAll() ? 'Скрыть отзывы' : 'Показать все отзывы'
    },
  },
  mounted() {
    this.reviewsMax = this.reviewsShowDefault
  },

  methods: {
    showReviewsToggle() {
      this.reviewsMax = this.showReviewsAll() ? this.reviewsShowDefault : this.feedbacks.length
    },
    showReviewsAll() { return this.reviewsMax > this.reviewsShowDefault && this.feedbacks.length > this.reviewsShowDefault}
  }
}
</script>

<style lang="scss" scoped>
.not-reviews {
  display: block;
  font-size: 24px;
  text-align: center;
  span {
    font-size: inherit;
    display: inline;
  }
  a {
    font-size: inherit;
    display: inline-block;
    margin-left: .25em;
  }
}
</style>
