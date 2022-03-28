<template lang="pug">
  main.container
    v-preloader.in-page(v-if="$fetchState.pending")
    template(v-else)
      h1.product-title {{title}}
      .product-additional
        .product-additional_item
          span.el-label Артикул:
          span.el-text {{art}}
        .product-rating-block
          v-stars(:rating="stars || 0" )
          nuxt-link.product-feedbacks.link(to="#feedbacks") {{feedBack}} 
        .product-additional_item 
          span.el-text Купили {{kupili}} раз

      section.content-section.product-page
        .product-page-column.slider
          .product-page-row
            .product-slider-block.thumbs
              .thumbs-layout
                .thumbs-body
                  vue-slick-carousel(
                    v-bind="settingsProductSliderThumbs"
                    ref="productSliderThumbs"
                    :asNavFor="$refs.productSlider",
                    :key="thumbsSliderKey"
                  )
                    .thumbs-item(
                      v-for="(itm, ind ) in images"
                      :key="`thumbs-${ind}`"
                    ) 
                      .thumbs-item_content
                        .img-box
                          img(:src="imgPath + itm")

                    template( v-slot:prevArrow)
                      button.thumbs-arrow.prev
                        svg.icon.icon-arrow-default <use href="#icon-arrow-default"/>
                    template( v-slot:nextArrow)
                      button.thumbs-arrow.next
                        svg.icon.icon-arrow-default <use href="#icon-arrow-default"/>


            .product-slider-block
              .product-slider
                vue-slick-carousel(
                  v-bind="settingsProductSlider"
                  ref="productSlider"
                  :asNavFor="$refs.productSliderThumbs"
                  :key="productSliderKey"
                  )
                  .product-slider-item(
                    v-for="(item, index ) in images"
                    :key="`slider-${index}`"
                    ) 
                    .product-slider-item-content
                      .img-box
                        .test
                          vue-photo-zoom-pro(
                              :url="imgPath + item"
                              :highUrl="imgPath + item"
                              :width="imgWidth"
                              :height="imgHeight"
                              @update="imgUpdate"
                            )


          .product-page-row.show-desktop(v-if="info_table && info_table.length")
            .product-slider-block.thumbs
            .product-info-block
              .product-info-row( v-for="(item, index) in info_table" :key="index" )
                .product-info-label {{item.name}}:
                .product-info-text {{item.value}}

        
        .product-page-column.right
          //- h1.product-title {{title}}
          .product-page-price-block
            .actual {{price}} {{$options.RUB}}
            .old {{oldprice}} {{$options.RUB_OLD}}
          .product-info-block.right
            .product-info-row(
              v-for="(p, i) in params"
              :key="`param-${i}`"
            )
              .product-info-label {{p.name}}:
              .product-info-text {{p.value}}
          
          .product-other-block(
            v-if="sameart && sameart.length"
            ref="otherBlock"
            
            )  
            vue-slick-carousel.product-other-slider(
              v-bind="settingsProductOtherSlider"
              ref="prOtherSlider"
              :class="{ hide: sameart.length <= otherSliderItemsShow }"
              )
              .other-slider-item(
                v-for="(it, i ) in sameart"
                :key="`os-${i}`"
              ) 
                nuxt-link.other-slider-item-content(
                  :to="it.alias"
                  :title="it.comment"
                  :class="{current: it.alias === alias}"
                  
                  )
                  .img-box
                    img(:src="imgPath + it.image")  

              template(#prevArrow)
                button.other-slider-arrow
                  svg.icon.icon-arrow-default <use href="#icon-arrow-default"/>
              template(#nextArrow)
                button.other-slider-arrow
                  svg.icon.icon-arrow-default <use href="#icon-arrow-default"/>
          client-only
            product-tab-sizes(
              :sizes="sizes"
              :selected-size="selectedSize"
              @select-size="selectSize"
              )

          
          .product-quantity-block(v-if="selectedSize")
            .product-quantity-label {{$options.QUANTITY_LABEL}}
            .product-quantity
              v-input-number(
                v-if="selectedSize"
                :has-label="false"
                :min="1"
                :max="selectedSize.ostatok"
                :step="1"
                :val="selectedSizeCount"
                v-model="selectedSizeCount"
                border-color="currentColor"
              )  
              .product-quantity-available( v-if="selectedSize") {{$options.AVAILABLE_LABEL}}{{selectedSize.ostatok}}
          
          .product-order-block
            .product-delivery-info
              .product-delivery-label 
                span.label {{$options.DELIVERY_LABEL}}
                span.text Хрен знает когда
              .btn(@click.prevent="addToCart") {{$options.ADD_TO_BASKET_TEXT}}
            div
              .product-delivery-info-text
                svg.icon.icon-delivery <use href="#icon-delivery"/>
                span {{$options.DELIVERY_TEXT}}
              .product-delivery-info-text
                svg.icon.icon-return-arrows <use href="#icon-return-arrows"/>
                span {{$options.RETURN_TEXT}}

          .product-info-block.show-mobile(v-if="info_table && info_table.length")
            .product-info-row( v-for="(item, index) in info_table" :key="index" )
              .product-info-label {{item.name}}:
              .product-info-text {{item.value}}


      
      section.feedbacks(id="feedbacks")  
        .product-page-column.slider
          .product-page-row
            .product-slider-block.thumbs
            .product-slider-block(v-if="feedbacks")
              .feedbacks-title
                .title {{$options.FEEDBACK_TITLE_TEXT}}
                v-stars(:rating="stars || 0" )
                .product-feedbacks(
                  v-if="feedbacks.length > 0"
                  @click="feedbackAllShow"  
                  :class="{'base2-to-base4': feedbackAll}"  
                ) {{feedBack}} 
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
import {mapState} from 'vuex'

import VueSlickCarousel from 'vue-slick-carousel'
// import InnerImageZoom from 'vue-inner-image-zoom'
// import 'vue-inner-image-zoom/lib/vue-inner-image-zoom.css'

import VuePhotoZoomPro from 'vue-photo-zoom-pro'
import 'vue-photo-zoom-pro/dist/style/vue-photo-zoom-pro.css'

export default {
  name:'product-page',
  components:{
    VueSlickCarousel,
    // InnerImageZoom,
    VuePhotoZoomPro,
  },
  data: function () {
    return {
      imgWidth: 0,
      imgHeight: 0,
      // loading: false,
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
            breakpoint: 767,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              infinite: true,
              dots: true,
              variableWidth: true,
              dotsClass: "slick-dots product-slider-dots",
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true,
              dots: true,
              variableWidth: false,
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
        infinite: true,
        // infinite: false,
        // vertical: false,
        // speed: 500,
        variableWidth: true,
        slidesToShow: 7,
        slidesToScroll: 1,
        // centerMode: true,
        // centerPadding: '0',
        responsive: [
          {
            breakpoint: 1600,
            settings: {
              slidesToShow: 6,
            }
          },
          {
            breakpoint: 1300,
            settings: {
              slidesToShow: 5,
            }
          },
          {
            breakpoint: 1100,
            settings: {
              slidesToShow: 4,
            }
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 7,
            }
          },
        ]


      },
      feedbackVisible:null, // Массив видимых отзывов
      feedbackOnlyWithFoto: false, // Массив видимых отзывов
      feedbackCount:2,      // Количество выведены отзывов
      feedbackLoadingStep:2, // Шаг вывода для кнопки "показать больше"
      feedbackAll: false,
      quantity: 1,           // Количество выбранных товаров текущего вида 
      selectedSize: null,
      selectedSizeCount: 1,
      productSliderKey: 'p1',
      thumbsSliderKey: 't1'
    }
  },
  SHOE_SIZE: 'Размер обуви:',
  // TABLE_SIZES_TEXT: 'Таблица размеров',
  ADD_TO_BASKET_TEXT: 'Добавить в корзину',
  DELIVERY_LABEL: 'Доставка: ',
  DELIVERY_TEXT: 'Стоимость доставки зависит от суммы покупки',
  RETURN_TEXT: 'Имеется возможность возврата',
  AVAILABLE_LABEL: 'В наличии: ',
  QUANTITY_LABEL: 'Количество:',
  FEEDBACK_TITLE_TEXT: 'Отзывы:',
  FEEDBACK_SHOW_MORE: 'Показать больше отзывов',
  FEEDBACK_NO_TITLE: 'У товара пока ещё нет отзывов',
  FEEDBACK_NO_TEXT: 'Станьте первым, кто поможет определиться другим покупателям с выбором',
  FEEDBACK_NO_BTN: 'Написать отзыв',
  ONLY_WITH_FOTO: 'только с фото',
  RUB: 'руб.',
  RUB_OLD: 'р.',
  OTHTER_SLIDER_SHOW_ITEMS_DEFAULT: {count: 7, width: 107},
  OTHTER_SLIDER_SHOW_ITEMS: {
    1200: {count: 5, width: 107},
    992: {count: 4, width: 85},
    767: {count: 7, width: 75},
    576: {count: 7, width: 43}
  },
  async fetch() {
    const res = await this.$store.dispatch('product/fetchProduct', this.$route.params.alias)
    if (res ==='error') return this.$nuxt.error({ statusCode: 404, message: 'Раздел не найден' })
  },

  computed: {
    ...mapState('product', [
      'alias', 'art', 'case', 'caseq', 'category', 'category_id', 'comment', 
      'daytoday', 'delivery', 'econom', 'feedbacks', 'filters', 'hit', 'id', 
      'images', 'info_table', 'kupili', 'labels', 'menuItems', 'new', 'oldprice', 
      'otzyvov', 'params', 'price', 'prices', 'prices_table', 'prodano', 'qsign', 
      'razdel', 'razdel_id', 'razdel_id1', 'sameart', 'sizes', 'socks', 'stars', 
      'status', 'thumbs', 'title', 'tu'
    ]),    
    feedBack() {
      // const arr = ['отзыв','отзыва','отзывов']
      return `${this.otzyvov} ${this.$numFeedbacks(this.otzyvov)}`

    },
    sale() { return this.$sale(this.price, this.oldprice) || 0},
    title() {return this.$store.getters['getPageTitle']},
    imgPath() {return this.$store.getters['settings/imgPath']},
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
      if ( !process.browser || !this.sameart ) return 'auto'
      // Определяем количество видимых слайдов
      const tmp = this.otherSliderItemsShowSettings
      const sliderVisibleItems = Math.min(this.sameart.length, tmp.count)
      // Возвращаем ширину слайдера    
      return `${tmp.width * sliderVisibleItems}px`
    },
    otherSliderItemsShow() {
      const tmp = this.otherSliderItemsShowSettings
      return Math.min(this.sameart.length, tmp.count)
    },

  },
  mounted(){
    this.$nextTick( this.$forceUpdate )

    if (this.feedbacks && this.feedbacks.length) this.feedbackVisible = this.feedbacks.slice(0, this.feedbackCount)
    if (process.browser && this.sizes) {
      const currentSize = this.sizes.find(sz => sz.active && sz.ostatok)
      if (currentSize) this.selectSize({value: currentSize, toggle:true})
    }


  },
  methods : {
    imgUpdate(e){
      this.imgWidth = e.width
      this.imgHeight = e.height
    },
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
      if (v.toggle) {
        this.selectedSizeCount = v.value.count || 1
        this.selectedSize = v.value
      }
    },
    async addToCart() {
      const val = []
      val.push({scode: this.selectedSize.scode, q: this.selectedSizeCount })
      // console.log('val: ', val)
      this.$store.dispatch('cart/addToCart', val)
      await this.$nuxt.refresh()
    },


  }


}

</script>

<style lang="scss">
@import "product-page";
.test {
  position: static;
}
</style>
