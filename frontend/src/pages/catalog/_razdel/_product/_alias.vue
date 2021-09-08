<template lang="pug">
  main.container(v-if="content")
    //- section
      v-breadcrumbs(v-if="breadcrumbs"  :items="breadcrumbs")
    loading.center(v-if="loading")
    section.content-section.product-page(v-else)
      .product-page-column.slider
        .product-page-row
          .product-slider-block.thumbs
            .product-additional
            .thumbs
              vue-slick-carousel(
                v-bind="settingsProductSliderThumbs"
                ref="productSliderThumbs"
                :asNavFor="$refs.productSlider",
              )
                .thumbs-item(
                  v-for="(itm, ind ) in content.images"
                  :key="`thumbs-${ind}`"
                ) 
                  .thumbs-item_content
                    .img-box
                      img(:src="itm")

                template( v-slot:prevArrow)
                  button.thumbs-arrow.prev
                    svg.icon.icon-arrow-default <use href="#icon-arrow-default"/>
                template( v-slot:nextArrow)
                  button.thumbs-arrow.next
                    svg.icon.icon-arrow-default <use href="#icon-arrow-default"/>


          .product-slider-block
            .product-additional
              .product-tags
                .product-tag(v-if="sale")
                  span Sale
                  svg.icon.icon-percent <use href="#icon-percent"/>
                .product-tag(v-if="content.new")
                  span New
                  svg.icon.icon-arrow-new <use href="#icon-arrow-new"/>
                .product-tag(v-if="content.hit")
                  span Hit
                  svg.icon.icon-fire <use href="#icon-fire"/>
              .product-rating-block
                nuxt-link.product-feedbacks(to="#feedbacks") {{feedBack}} 


                v-stars(:rating="content.stars || 0" )
              

            .product-slider
              vue-slick-carousel(
                v-bind="settingsProductSlider"
                ref="productSlider"
                :asNavFor="$refs.productSliderThumbs"
              )
                .product-slider-item(
                  v-for="(item, index ) in content.images"
                  :key="`slider-${index}`"
                ) 
                  .product-slider-item-content
                    .img-box
                      img(:src="item")



        .product-page-row
          .product-slider-block.thumbs
          .product-info-block
            .product-info-row
              .product-info-label Артикул:
              .product-info-text {{content.art}}
            .product-info-row
              .product-info-label Комплектация:
              .product-info-text Что тут выводим?
            .product-info-row
              .product-info-label Производитель:
              .product-info-text {{content.category.brand}}
            .product-info-row
              .product-info-label Описание:
              .product-info-text {{content.description}}

      
      .product-page-column.right
        h1.product-title {{title}}
        .product-page-price-block
          .actual {{content.price}} {{$options.RUB}}
          .old {{content.oldprice}} {{$options.RUB}}
        .product-info-block.right
          .product-info-row(
            v-for="(p, i) in content.params"
            :key="`param-${i}`"
          )
            .product-info-label {{p.name}}:
            .product-info-text {{p.value}}
        
        .product-other-block(
          v-if="content.sameart && content.sameart.length"
          ref="otherBlock"
          
          )  
          vue-slick-carousel.product-other-slider(
            v-bind="settingsProductOtherSlider"
            ref="prOtherSlider"
            )
            .other-slider-item(
              v-for="(it, i ) in content.sameart"
              :key="`os-${i}`"
            ) 
              nuxt-link.other-slider-item-content(
                :to="it.alias"
                :title="it.comment"
                :class="{current: it.alias === content.alias}"
                
                )
                .img-box
                  img(:src="it.image")  

            template(#prevArrow)
              button.other-slider-arrow
                svg.icon.icon-arrow-default <use href="#icon-arrow-default"/>
            template(#nextArrow)
              button.other-slider-arrow
                svg.icon.icon-arrow-default <use href="#icon-arrow-default"/>
        //- .product-sizes-table(v-if="sizes")
          .product-sizes-item(
            v-for="(item, index) in sizes" :key="index"
            :class="{'in-stock' : item.ostatok > 0 }"
            :title="`${$options.SHOE_SIZE} ${item.name.slice(4, item.name.length - 1)}`"
            @click="selectSize(item)"
          ) {{item.name.slice(0,2)}}

        
        .product-quantity-block
          .product-quantity-label {{$options.QUANTITY_LABEL}}
          .product-quantity
            input-number(
              v-if="selectedSize"
              :has-label="false"
              :min="1"
              :max="selectedSize.ostatok"
              :step="1"
              :val="selectedSize.count"
              v-model="selectedSize.count"
              border-color="currentColor"
            )  
            .product-quantity-available( v-if="selectedSize") {{$options.AVAILABLE_LABEL}}{{selectedSize.ostatok}}
        
        .product-order-block
          div
            .product-delivery-info
              .product-delivery-label 
                span.label {{$options.DELIVERY_LABEL}}
                span.text Хрен знает когда
              .btn() {{$options.ADD_TO_BASKET_TEXT}}
          div
            .product-delivery-info-text
              svg.icon.icon-delivery <use href="#icon-delivery"/>
              span {{$options.DELIVERY_TEXT}}
            .product-delivery-info-text
              svg.icon.icon-return-arrows <use href="#icon-return-arrows"/>
              span {{$options.RETURN_TEXT}}



    section.feedbacks(id="feedbacks")  
      .product-page-column.slider
        .product-page-row
          .product-slider-block.thumbs
          .product-slider-block(v-if="feedbacks")
            .feedbacks-title
              .title {{$options.FEEDBACK_TITLE_TEXT}}
              v-stars(:rating="content.stars || 0" )
              .product-feedbacks(
                @click="feedbackAllShow"  
                :class="{'base2-to-base4': feedbackAll}"  
              ) {{feedBack}} 
              .product-feedbacks(
                  :class="{selected: feedbackOnlyWithFoto}"
                  @click="feedbackOnlyWithFotoShow"
                ) {{$options.ONLY_WITH_FOTO}}
            .feedbacks-block
              .feedback-item(v-for="(f, l) in feedbackVisible" :key="f.id")
                .feedback-user-avatar
                  svg.icon.icon-user-avatar-default <use href="#icon-user-avatar-default"/>
                .feedback-user-body
                  .feedback-user-name {{f.name}}
                  .feedback-user-rating 
                    v-stars(:rating="f.stars || 0" )
                  .feedback-user-text {{f.otzyv}}
                  .feedback-user-foto

                  .feedback-answer(v-if="f.otvet.length") 
                    .feedback-answer-title 
                      svg.icon.icon-avatar-nosmag <use href="#icon-avatar-nosmag"/>
                      span Nosmag
                    .feedback-answer-text {{f.otvet}}

              .feedbacks-show-more(
                  v-if="feedbackCount < feedbacks.length"
                  @click="showMoreFeedback"

                ) {{$options.FEEDBACK_SHOW_MORE}} 
  
</template>
<script>
import vLoading from '~/components/common/preloader/preloader'
// import vBreadcrumbs from '~/components/common/breadcrumbs/breadcrumbs'
import vStars from '~/components/common/stars/stars'
import VueSlickCarousel from 'vue-slick-carousel'
import inputNumber from '~/components/common/forms/input-number/input-number'

export default {
  components:{
    vLoading,
    // vBreadcrumbs,
    vStars,
    VueSlickCarousel,
    inputNumber,
  },
  data: function () {
    return {
      loading: false,
      onlyWithFoto: false,
      settingsProductSlider: {
        lazyLoad: 'ondemand',
        dots: false,
        arrows: false,
        infinite: true,
        draggable: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        focusOnSelect: true,

        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              infinite: true,
              dots: true,
              variableWidth: true,
              dotsClass: "slick-dots product-slider-dots",
            }
          }
        ]

      },
      settingsProductSliderThumbs: {
        lazyLoad: 'ondemand',
        dots: false,
        // dotsClass: "slick-dots main-slider-dots",
        arrows: true,
        // edgeFriction: 0.35,
        infinite: true,
        // infinite: false,
        vertical: true,
        // speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        focusOnSelect: true,
      },
      settingsProductOtherSlider: {
        dots: false,
        arrows: true,
        // infinite: true,
        infinite: false,
        // vertical: false,
        // speed: 500,
        variableWidth: true,
        slidesToShow: 7,
        slidesToScroll: 1,
        // centerMode: true,
        // centerPadding: '0',

      },
      feedbackVisible:null, // Массив видимых отзывов
      feedbackOnlyWithFoto: false, // Массив видимых отзывов
      feedbackCount:2,      // Количество выведены отзывов
      feedbackLoadingStep:2, // Шаг вывода для кнопки "показать больше"
      feedbackAll: false,
      quantity: 1,           // Количество выбранных товаров текущего вида 
      selectedSize: null,

    }
  },
  SHOE_SIZE: 'Размер обуви:',
  ADD_TO_BASKET_TEXT: 'Добавить в корзину',
  DELIVERY_LABEL: 'Доставка: ',
  DELIVERY_TEXT: 'Стоимость доставки зависит от суммы покупки',
  RETURN_TEXT: 'Имеется возможность возврата',
  AVAILABLE_LABEL: 'В наличии: ',
  QUANTITY_LABEL: 'Количество:',
  FEEDBACK_TITLE_TEXT: 'Отзывы:',
  FEEDBACK_SHOW_MORE: 'Показать больше отзывов',
  ONLY_WITH_FOTO: 'только с фото',
  RUB: 'руб.',
  OTHTER_SLIDER_SHOW_ITEMS_DEFAULT: {count: 7, width: 107},
  OTHTER_SLIDER_SHOW_ITEMS: {
    1200: {count: 5, width: 107},
    992: {count: 4, width: 85},
    767: {count: 7, width: 75},
    576: {count: 7, width: 43}
  },
  asyncData: async function ({store, params}) {
    // console.log('catalog/_razdel/product/_alias params', params)
    await store.dispatch('fetchContent', params.alias)
  },
  computed: {
    feedBack() {
      // const arr = ['отзыв','отзыва','отзывов']
      if (this.content) {
        // return `${this.content.otzyvov} ${this.$numWord(this.content.otzyvov, arr)}`
        return `${this.content.otzyvov} ${this.$numFeedbacks(this.content.otzyvov)}`
      }
    },
    sale() { return this.$sale(this.content.price, this.content.oldprice) || 0},
    // ...mapGetters('razdel',['products', 'page', 'pageCount']),
    // ...mapGetters('settings',['sortmodes']),
    title() {return this.$store.state.content.data.name || ''},
    content() { return this.$store.getters['getContentData'] || null},
    feedbacks() { return this.$store.state.content.data.feedbacks || null},
    sizes() { return this.$store.state.content.data.sizes || null},
    // products() { return this.$store.state.content.data.items || null},
    // filters() { return this.$store.state.content.data.filters || null},
    // breadcrumbs() {return this.$store.getters['getBreadcrumbs']},
    otherSliderItemsShowSettings() {
      if (!process.browser) return 1
      const innerW = window.innerWidth
      const ossi = this.$options.OTHTER_SLIDER_SHOW_ITEMS
      const ossiKeys = Object.keys(ossi)
                        .map(itm => parseInt(itm,10))
                        .sort(this.$compareNumeric)
                        .reverse()
      const ossiKeyIndex = ossiKeys.find(item => this.$compareNumeric(item, innerW) >=0 )
      return ossiKeyIndex ? ossi[ossiKeyIndex] : this.$options.OTHTER_SLIDER_SHOW_ITEMS_DEFAULT
    },

    getOtherSliderWidth(){
      // Если функция вызвана на сервере или если нет других цветов товара
      if ( !process.browser || !this.content.sameart ) return 'auto'
      // Определяем количество видимых слайдов
      const tmp = this.otherSliderItemsShowSettings
      const sliderVisibleItems = Math.min(this.content.sameart.length, tmp.count)
      // Возвращаем ширину слайдера    
      return `${tmp.width * sliderVisibleItems}px`
    },
    otherSliderItemsShow() {
      const tmp = this.otherSliderItemsShowSettings
      return Math.min(this.content.sameart.length, tmp.count)
    },

  },
  beforeMount() {
    // debugger
  },
  mounted(){
    this.$nextTick(this.$forceUpdate)
    // this.$refs.otherBlock.style.maxWidth = this.getOtherSliderWidth
    if (this.content.sameart.length <= this.otherSliderItemsShow){
      // debugger
     this.$refs.prOtherSlider.$el.classList.add('hide')
     } else {
      //  debugger
     this.$refs.prOtherSlider.$el.classList.remove('hide')
     }
    if (this.feedbacks && this.feedbacks.length) this.feedbackVisible = this.feedbacks.slice(0, this.feedbackCount)
    if (this.sizes && this.sizes.length) this.selectedSize = Object.assign({}, this.sizes[0])
    

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
    selectSize(v) {
      this.selectedSize = v
    },
  }


}

</script>

<style lang="scss">
@import "product-page";
</style>
