<template lang="pug">
  .review-item(:data-review-id="review.id")
    .review-item-title
      .review-user
        .review-user-avatar
          svg.icon.icon-user <use href="#icon-user"/>
        .review-user-info
          .review-user-name {{review.name}}
          .review-user-date {{ date }}

      .review-rating
        stars(:rating="review.stars")
    .review-text {{review.otzyv}}
    .review-answer(v-if="(review.otvet && review.otvet.length)" )
      .review-answer-title
        svg.icon.icon-logo <use href="#icon-logo"/>
        span Ответ Представителя бренда
      .review-answer-text {{review.otvet}}
    .review-footer
      span Оценка полезна?
      span
        span.rating-useful.up
          svg.icon.icon-review-up <use href="#icon-review"/>
          span 0
        span.rating-useful.down
          svg.icon.icon-review-down <use href="#icon-review"/>
          span 0

</template>

<script>
import stars from '~/components/common/stars/stars'
export default {
  name: 'reviews-item',
  components: { stars },
  props: ['review'],
  computed: {
     date: th => th.$dateFns.format(new Date(th.review.datetime), 'd MMMM yyyy г.' )
  },

}
</script>

<style scoped>

</style>
