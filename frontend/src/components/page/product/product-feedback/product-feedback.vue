<template lang="pug">
  section.feedbacks(v-if="feedbacks && feedbacks.length" id="feedbacks")  
    template(v-if="feedbacks")
      //- .feedbacks-title
        .title {{$options.FEEDBACK_TITLE_TEXT}}
        v-stars(:value="stars || 0" )
        .product-feedbacks(
          v-if="feedbacks.length > 0"
          @click="feedbackAllShow"  
          :class="{'base2-to-base4': feedbackAll}"  
        ) {{`${otzyvov} ${$declensionEndings(otzyvov, 'otzyv')}`}} 
        .product-feedbacks(
          v-if="feedbacks.length > 0"
          :class="{selected: feedbackOnlyWithFoto}"
          @click="feedbackOnlyWithFotoShow"
        ) {{$options.ONLY_WITH_FOTO}}
      .feedbacks-block.no-feedback(v-if="feedbacks.length===0")
        .feedback-item.title {{$options.FEEDBACK_NO_TITLE}}
        .feedback-item.text {{$options.FEEDBACK_NO_TEXT}}
        .feedback-item 
          .btn.btn-3 {{$options.FEEDBACK_NO_BTN}}

      .feedbacks-block(v-else)
        .feedback-item(v-for="(f, l) in feedbackVisible" :key="f.id")
          .feedback-user-avatar
            svg.icon.icon-user-avatar-default <use href="#icon-user-avatar-default"/>
          .feedback-user-body
            .feedback-user-name {{f.name}}
            .feedback-user-rating 
              v-stars(:value="f.stars || 0" )
            .feedback-user-text {{f.otzyv}}
            .feedback-user-foto

            .feedback-answer(v-if="f.otvet.length") 
              .feedback-answer-title 
                svg.icon.icon-avatar-nosmag <use href="#icon-avatar-nosmag"/>
                span Nosmag
              .feedback-answer-text {{f.otvet}}

        .feedbacks-show-more.link(
            v-if="feedbackCount < feedbacks.length"
            @click="showMoreFeedback"

          ) {{$options.FEEDBACK_SHOW_MORE}} 
    
</template>

<script>
  export default {
    name: 'product-feedbaks',
    props: {
      feedbacks: {
        type: Array,
        default() {return null},
        request: true
      },
      stars: {},
      otzyvov: {}
    },
    FEEDBACK_TITLE_TEXT: 'Отзывы:',
    FEEDBACK_SHOW_MORE: 'Показать больше отзывов',
    FEEDBACK_NO_TITLE: 'У товара пока ещё нет отзывов',
    FEEDBACK_NO_TEXT: 'Станьте первым, кто поможет определиться другим покупателям с выбором',
    FEEDBACK_NO_BTN: 'Написать отзыв',
    ONLY_WITH_FOTO: 'только с фото',
    data() {
      return {
        feedbackVisible:null, // Массив видимых отзывов
        feedbackOnlyWithFoto: false, // Массив видимых отзывов
        feedbackCount:2,      // Количество выведены отзывов
        feedbackLoadingStep:2, // Шаг вывода для кнопки "показать больше"
        feedbackAll: false,

      }
    },
    mounted(){
      // this.$nextTick( this.$forceUpdate )
      if (this.feedbacks && this.feedbacks.length) this.feedbackVisible = this.feedbacks.slice(0, this.feedbackCount)
    },
  methods : {
    showMoreFeedback() {
      this.feedbackCount += this.feedbackLoadingStep
      this.feedbackVisible = this.feedbacks.slice(0, this.feedbackCount)  
    },

    feedbackOnlyWithFotoShow() {
      this.feedbackOnlyWithFoto = true
      this.feedbackAll = false
    },
    feedbackAllShow() {
      this.feedbackCount = 0
      this.feedbackOnlyWithFoto = false
      this.feedbackAll = true
      setTimeout(() => this.feedbackAll = false, 500);
      this.showMoreFeedback()
    },


  }

  }
</script>

<style lang="scss" scoped>
@import 'product-feedback'
</style>