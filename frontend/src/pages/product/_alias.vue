<template lang="pug">
  main.container
    v-preloader.in-page(v-if="$fetchState.pending")
    template(v-else)
      h1.product-title.show-desktop {{data.name}}
      //- ============= Строка информации о рейтинге и кол-ве покупок ===============
      .product-additional.show-desktop
        .product-additional_item
          span.el-label Артикул:
          span.el-text {{data.art}}
        .product-rating-block
          v-stars(:value="data.stars || 0" )
          nuxt-link.product-feedbacks.link(to="#feedbacks") {{declensionEndings(data.otzyvov,'otzyv')}} 
        .product-additional_item(v-if="data.prodano") 
          span.el-text Купили {{declensionEndings(data.prodano,'raz')}}

      //- ============= Блок основного слайдера ===============
      section.content-section.product-page
        .product-page-column.slider
          .product-page-row.main-slider
            //- ============= Слайдер thumbs ===============
            .product-slider-block.thumbs(:class="{ 'has-arrow' : data.images && data.images.length > 4 }")
              vue-slick-carousel.thumbs-slider(
                v-bind="settingsProductSliderThumbs"
                ref="productSliderThumbs"
                :asNavFor="$refs.productSlider",
                :key="thumbsSliderKey"
                )
                .thumbs-item(
                  v-for="(itm, ind ) in data.images"
                  :key="`thumbs-${ind}`"
                  ) 
                  .thumbs-item_content
                    .img-box
                      img(:src="imgPath + itm")

                template(#prevArrow)
                  .thumbs-arrow.prev
                    svg.icon.icon-arrow-down <use href="#icon-arrow-down"/>
                template(#nextArrow)
                  .thumbs-arrow.next
                    svg.icon.icon-arrow-down <use href="#icon-arrow-down"/>

            //- ============= Главный Слайдер ===============
            .product-slider-block
              //- .product-slider
              vue-slick-carousel.product-slider(
                v-bind="settingsProductSlider"
                ref="productSlider"
                :asNavFor="$refs.productSliderThumbs"
                :key="productSliderKey"
                )
                .product-slider-item(
                  v-for="(item, index ) in data.images"
                  :key="`slider-${index}`"
                  ) 
                  .product-slider-item-content
                    .img-box
                      //- img(:src="imgPath + item" )
                      vue-photo-zoom-pro(
                        :url="imgPath + item"
                        :highUrl="imgPath + item"
                        :width="imgWidth"
                        :height="imgHeight"
                        @update="imgUpdate"
                        )

          //- ============= Блок инфы под Главным Слайдером ===============
          .product-page-row.show-desktop.show-info(v-if="data.info_table && data.info_table.length")
            .product-description-block(v-if="data.info && data.info.length")
              .product-title {{$options.DESCRIPTION}}
              v-clamp.product-description-info(autoresize :max-lines="5" ) {{data.info}}
                template(#after="{ expand, clamped }")
                  span( 
                    v-if="clamped" 
                    @click="expand" 
                    class="show-more link"
                    v-html="`${$options.SHOW_MORE}`"
                    ) 

            .product-info-block
              .product-info-row( v-for="(item, index) in data.info_table" :key="index" )
                .el-label {{item.name}}:
                .el-text {{item.value}}
          .product-page-row.show-mobile
            h1.product-title {{data.name}}
            //- ============= Строка информации о рейтинге и кол-ве покупок ===============
            .product-additional
              .product-additional_item
                span.el-label Артикул:
                span.el-text {{data.art}}
              .product-rating-block
                v-stars(:value="data.stars || 0" )
                nuxt-link.product-feedbacks.link(to="#feedbacks") {{declensionEndings(data.otzyvov,'otzyv')}} 
              .product-additional_item(v-if="data.prodano") 
                span.el-text Купили {{declensionEndings(data.prodano,'raz')}}

        //- ============= Правый столбец. Основная инфа ===============
        .product-page-column.right
          //- ====== Цена и скидка =======
          .product-page_price-block
            .actual( v-html="`${data.price} ${currencyShort}`")
            .old( v-if="sale" v-html="`${data.oldprice} ${currencyShort}`")
          .product-page_sale-block(v-if="data.skidka")
            .sale(v-if="data.skidka.proc") {{data.skidka.proc}}%
            .text(v-if="data.skidka.info") {{data.skidka.info}}

          //- ====== Лого производителя =======
          .product-page_brand-block(v-if="data.category")
            .product-page_brand-logo(v-if="data.category.logo && data.category.logo.length")
              //- .img-box
              img(:src="data.category.logo")
            .product-page_brand-text
              span(v-if="data.category.manufacturer && data.category.manufacturer.length") {{data.category.manufacturer}}
              span(v-if="data.category.country_of_origin && data.category.country_of_origin.length") {{data.category.country_of_origin}}

          //- ====== Параметры товара =========
          .product-info-block.right
            .product-info-row(
              v-for="(p, i) in data.params"
              :key="`param-${i}`"
            )
              .el-label {{p.name}}:
              .el-text {{p.value}}
          
          //- ============= Слайдер Другие цвета ===============
          .product-other-block(
            v-if="data.sameart && data.sameart.length"
            ref="otherBlock"
            )
            .el-label {{$options.SAMEART_LABEL}} {{data.sameart.length}}
            product-other-slider(
              :items="data.sameart"
              :current-alias="data.alias"
              )
          //- ============= Размер ===============
          .product-sizes-block
            .el-label {{$options.SELECT_SIZE}}
            .product-sizes-row
              .product-sizes_tab
                template(v-for="(tb, ind) in data.sizes")
                  v-dropdown(
                    v-if="tb.table && tb.table.length"
                    :triggers="['hover']"
                    )
                    label.product-sizes_tab-item( 
                      :key="ind"
                      :class="{ selected: selectedSize && selectedSize.scode === tb.scode}"
                      )
                      input(
                        type="radio" 
                        hidden 
                        v-model="selectedSize" 
                        :value="tb"
                        :disabled="!tb.active"
                        )
                      .product-sizes_tab-item-boby
                        .sizes-item-text.top(
                          v-if="tb.table[0] && tb.table[0].value"
                          :class="{ active: tb.active }"
                          ) {{tb.table[0].value}}
                        .sizes-item-text.bottom(v-if="tb.table[1] && tb.table[1].value") {{tb.table[1].value}}

                    template(#popper)
                      .product-sizes_popper
                        .product-sizes_popper_item(v-for="(tbProp, i) in tb.table" :key="i" )
                          .product-sizes_popper_item-label {{tbProp.name}}
                          .product-sizes_popper_item-value {{tbProp.value}}
                        .product-sizes_popper_item.report(
                          v-if="!tb.active"
                          @click="$vfm.show('tb-size-report')"
                          ) {{$options.TAB_SIZES_REPORT}}

              .product-sizes_tab-link.link(
                v-if="data.sizes_table && data.sizes_table.length"
                @click="$vfm.show('tb-size')"
                ) {{$options.TAB_SIZES}}


          //- ============= Количество ===============
          .product-quantity-block(v-if="selectedSize")
            .el-label {{$options.QUANTITY_LABEL}}
            .product-quantity
              v-input-number(
                v-if="selectedSize"
                :has-label="false"
                append-text="шт"
                :min="1"
                :max="selectedSize.ostatok"
                :step="1"
                :val="selectedSizeCount"
                v-model="selectedSizeCount"
                
              )  
              .product-quantity-available( v-if="selectedSize") {{$options.AVAILABLE_LABEL}}{{selectedSize.ostatok}}

          //- ============= Слайдер Упаковки ===============
          .product-other-block(
            v-if="data.cases && data.cases.length"
            ref="casesBlock"
            )
            .el-label {{$options.CASES_LABEL}} {{data.cases.length}}

            product-other-slider(
              :items="data.cases"
              :is-link="false"
              :is-cases="true"
              v-model="selectedCase"
              )
          //- ============= Кнопка Добавить в корзину ===============
          .product-add2cart_panel
            .product-add2cart_row
              div Итого
              div( v-html="`${data.price * selectedSizeCount} ${currencyShort}`") 

            .btn.product-add2cart(
              :class="{ disabled: startAdd2Cart }"
              @click.prevent="addToCart"

              ) {{$options.ADD_TO_BASKET_TEXT}}

          //- ============= Блок инфы о доставке ===============
          .product-delivery-info
            .product-delivery-info-text
              svg.icon.icon-refund <use href="#icon-refund"/>
              span {{$options.RETURN_TEXT}}
            .product-delivery-info-text
              svg.icon.icon-box <use href="#icon-box"/>
              span {{$options.DELIVERY_TEXT}}

          //- ============= Блок инфы под Главным Слайдером для варианта мобилки ===============
          .product-info-block.show-mobile(v-if="data.info_table && data.info_table.length")
            .product-description-block(v-if="data.info && data.info.length")
              .product-title {{$options.DESCRIPTION}}
              v-clamp.product-description-info(autoresize :max-lines="5" ) {{data.info}}
                template(#after="{ expand, clamped }")
                  span( 
                    v-if="clamped" 
                    @click="expand" 
                    class="show-more link"
                    v-html="`${$options.SHOW_MORE}`"
                    ) 

            .product-info-block
              .product-info-row( v-for="(item, index) in data.info_table" :key="index" )
                .el-label {{item.name}}:
                .el-text {{item.value}}

      //- ============= Форма Отзыва ===============
      h2.product-title {{$options.FEEDBACK.FORM_TITLE}}
      section.content-section.feedback-form
        .product-page-column.slider
          .feedback-form_label {{$options.FEEDBACK.FORM_LABEL}}
          v-input-field.feedback-form_text(
            type="textarea"
            :placeholder="$options.FEEDBACK.FORM_PLACEHOLDER"
            v-model="userFeedback.text"
          )
          .btn(@click="addFeedback") {{$options.FEEDBACK.FORM_BTN}}

        .product-page-column.right.feedback-mobile
          div
            .feedback-form_label {{$options.FEEDBACK.FORM_STARS_LABEL}}
            v-stars.feedback-form_stars( v-model="userFeedback.stars" )
          div  
            .feedback-form_label {{$options.FEEDBACK.FORM_FOTO_LABEL}}
            .feedback-form_files
              svg.icon.icon-attach <use href="#icon-attach"/>
              .feedback-form_files-link {{$options.FEEDBACK.FORM_FOTO_LINK_TEXT}}

      //- ============= Блок Отзывов ===============
      template(v-if="data.feedbacks && data.feedbacks.length")
        h2.product-title {{$options.FEEDBACK.USER_TITLE}}
        section.content-section.feedback-form1
          .product-page-column.slider
            page-product-feedback(
              :feedbacks="filteredFeedbacks" 
              :stars="data.stars" 
              :otzyvov="data.otzyvov"
              :key="feedbackFilterKey"
              )
          .product-page-column.right
            .feedback-form_label {{$options.FEEDBACK.FORM_STARS_COUNT_LABEL}}
            v-check-box2.feedback-filter_item(
              v-for="st in feedbackFilterArr" 
              :key="st"
              :base-checked-color="'var(--base-color3)'"
              :value="st"
              v-model="feedbackFilter" 
              
              )
              v-stars.feedback-filter_stars( :value="st" )
              .feedback-filter_text( ) {{declensionEndings(getFilteredFeedbacks(st).length,'otzyv')}}
            .btn.btn-4.btn-transparent.feedback-filter_btn(@click="feedbackFilterToggle") {{feedbackFilterBtnText}}


    client-only  
      vue-final-modal(
        name="tb-size" 
        v-slot="{ close }" 
        v-model="tabSizesModalShow"
        :resize="false"
        :classes="['modal-container', 'default']"
        :content-class="['modal-content', 'default']"
        :overlay-class="['modal-overlay']"
        :max-width="tabSizeMaxWidth" 
        :max-height="tabSizeMaxHeight"
        :fit-parent="true"
        @opened="tabSizesModalOpened"
        )
        .modal-close(@click="close")
          svg.icon.icon-btn-close <use href="#icon-btn-close"/>
        perfect-scrollbar.modal-body( ref="tabSizesModalPs" )  
          .sizes-table(v-html="data.sizes_table")

    client-only
      vue-final-modal(
        name="tb-size-report" 
        v-slot="{ close }" 
        v-model="tabSizesReportModalShow"
        :resize="false"
        :classes="['modal-container', 'report-email']"
        :content-class="['modal-content', 'default']"
        :overlay-class="['modal-overlay']"
        :fit-parent="true"
        
        )

        .modal-close(@click="close")
          svg.icon.icon-btn-close <use href="#icon-btn-close"/>
        .modal-body
          .order-item-label
            span {{$options.EMAIL}}
            span.req *
          v-input-field(
            ref="email"
            v-model="reportEmail"
            type="email"
            :placeholder="$options.EMAIL_PLACEHOLDER"
            :error-text="$options.EMAIL_ERROR"
            :required="true"
          )
          .report-text.success {{$options.EMAIL_SUCCESS}}
          .btn {{$options.TAB_SIZES_REPORT}}

</template>
<script>
import {getInnerSize} from '@/utils/main-scripts'
import {mapState} from 'vuex'

import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'  

import VuePhotoZoomPro from 'vue-photo-zoom-pro'
import 'vue-photo-zoom-pro/dist/style/vue-photo-zoom-pro.css'



const otherSliderResponsive = [
  { breakpoint: Infinity, slidesToShow: 6, },
  { breakpoint: 1600, slidesToShow: 6, },
  { breakpoint: 1300, slidesToShow: 5, },
  { breakpoint: 1100, slidesToShow: 3, },
  { breakpoint: 767,  slidesToShow: 7, },
  { breakpoint: 0,    slidesToShow: 7, },
]

export default {
  name:'product-page',
  components:{
    VueSlickCarousel,
    VuePhotoZoomPro,
  },
  data() {
    return {
      data: {},
      imgWidth: 0,
      imgHeight: 0,
      tabSizesModalShow: false,
      tabSizesReportModalShow: false,
      startAdd2Cart: false,
      // hasArrows: false,
      // hasCasesArrows: false,
      reportEmail: '',
      reportEmailIsValid: 0,
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
              // slidesToShow: 2,
              // slidesToScroll: 1,
              // infinite: true,
              // dots: true,
              variableWidth: true,
              // dotsClass: "slick-dots product-slider-dots",
            }
          },
          {
            breakpoint: 480,
            settings: {
              // slidesToShow: 1,
              // slidesToScroll: 1,
              // infinite: true,
              // dots: true,
              variableWidth: false,
              // dotsClass: "slick-dots product-slider-dots",
            }
          }
        ]

      },
      settingsProductSliderThumbs: {
        lazyLoad: 'ondemand',
        dots: false,
        arrows: true,
        infinite: true,
        vertical: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        focusOnSelect: true,
      },
      // settingsProductOtherSlider: {
      //   // lazyLoad: 'ondemand',
      //   dots: false,
      //   arrows: true,
      //   infinite: true,
      //   infinite: false,
      //   variableWidth: true,
      //   // slidesToShow: 6,
      //   slidesToShow: 1,
      //   slidesToScroll: 1,
      //   rows: 1,
      //   // centerMode: true,
      //   // centerPadding: '0',
      //   // responsive: [
      //   //   {
      //   //     breakpoint: 1600,
      //   //     settings: {
      //   //       slidesToShow: 6,
      //   //     }
      //   //   },
      //   //   {
      //   //     breakpoint: 1300,
      //   //     settings: {
      //   //       slidesToShow: 5,
      //   //     }
      //   //   },
      //   //   {
      //   //     breakpoint: 1100,
      //   //     settings: {
      //   //       slidesToShow: 3,
      //   //     }
      //   //   },
      //   //   {
      //   //     breakpoint: 767,
      //   //     settings: {
      //   //       slidesToShow: 7,
      //   //     }
      //   //   },
      //   // ]


      // },
      quantity: 1,           // Количество выбранных товаров текущего вида 
      selectedSize: null,
      selectedSizeCount: 1,
      selectedCase: null,
      // selectedSizeCount: 1,
      productSliderKey: 'p1',
      thumbsSliderKey: 't1',
      userFeedback: {
        text: '',
        stars: 0,
        foto: []
      },
      feedbackFilter: [],
      feedbackFilterKey: 1,
      feedbackFilterBtnText: this.$options.FEEDBACK.SHOW_ALL_BTN,
      // feedbackFilterArr: [5, 4, 3, 2, 1],
    }
  },
  DESCRIPTION: 'Описание',
  SHOW_MORE: 'Читать дальше',
  SHOE_SIZE: 'Размер обуви:',
  SELECT_SIZE: 'Ваберите размер:',
  TAB_SIZES: 'Таблица размеров',
  TAB_SIZES_REPORT: 'Сообщить о поступлении',
  // TABLE_SIZES_TEXT: 'Таблица размеров',
  EMAIL: 'E-mail',
  EMAIL_PLACEHOLDER: 'Обязательное',
  EMAIL_ERROR: 'Не верно заполнено поле',
  EMAIL_SUCCESS: 'На вашу почту придёт уведомление о поступлении',
  ADD_TO_BASKET_TEXT: 'Добавить в корзину',
  DELIVERY_LABEL: 'Доставка: ',
  DELIVERY_TEXT: 'Стоимость доставки зависит от суммы покупки',
  RETURN_TEXT: 'Имеется возможность возврата',
  AVAILABLE_LABEL: 'В наличии: ',
  QUANTITY_LABEL: 'Количество:',
  SAMEART_LABEL: 'Другие цвета:',
  CASES_LABEL: 'Выберите упаковку:',
  
  FEEDBACK: {
    FORM_BTN: 'Оставить отзыв',
    FORM_TITLE: 'Оставьте свой отзыв',
    FORM_LABEL: 'Расскажите подробнее',
    FORM_PLACEHOLDER: 'Введите сообщение',
    FORM_STARS_LABEL: 'Отметить количество звёзд',
    FORM_STARS_COUNT_LABEL: 'Показать отзывы с оценкой',
    FORM_FOTO_LABEL: 'Добавьте фото',
    FORM_FOTO_LINK_TEXT: 'Нажмите, чтобы прикрепить фотографии',
    USER_TITLE: 'Отзывы покупателей',
    SHOW_ALL_BTN: 'Выделить все',
    SHOW_CLEAR_BTN: 'Снять выделение',
  },
  RUB: 'руб.',
  RUB_OLD: 'р.',
  OTHTER_SLIDER_SHOW_ITEMS_DEFAULT: {count: 7, width: 107},
  OTHTER_SLIDER_SHOW_ITEMS: {
    1200: {count: 5, width: 107},
    992: {count: 4, width: 85},
    767: {count: 7, width: 75},
    576: {count: 7, width: 43}
  },
  // async fetch() {
  //   const res = await this.$store.dispatch('product/fetchProduct', this.$route.params.alias)
  //   if (res ==='error') return this.$nuxt.error({ statusCode: 404, message: 'Раздел не найден' })
  // },
  async fetch() {
    try {
      this.$store.commit('setBreadcrumbs', [])
      const c = await this.$axios.$get(`/get_content`, {
        params: {
          alias: this.$route.params.alias,
          session_id: this.$store.state.token.session_id
        }
      })
      // return this.$nuxt.error({ statusCode: 404, message: c })
      if (c.status === 'ok' && c.type != '404' && c.type != '505') {
        // Преобразуем строковые числа в числа
        const content = this.$parseJsonStrToNumbers(c)
        // Добавляем статус и тип страницы в $store (не сильно надо, но пусть будут)
        if (content.status) this.$store.commit('setStatus', content.status)
        if (content.type) this.$store.commit('setType', content.type)
        // Меняем в html - Таблицы размеров <h1> на <h2>
        if (content.data.sizes_table && content.data.sizes_table.length) {
          let s = content.data.sizes_table
          s = s.split('<h1').join('<h2')
          s = s.split('h1/>').join('h2/>')
          content.data.sizes_table = s
        }
        // Добавляем полученные данные в data
        // цикл по ключам и значениям
        for (let [key, v] of Object.entries(content.data)) {
          if ( key==='breadcrumbs') { // Коммитим Крошки в $store
            this.$store.commit('setBreadcrumbs', v)
          } else { // Добавляем поле в data
            // this.$set(this.data, key, v)
            this.data[key] = v
          }
        }

      } else {
        return this.$nuxt.error({ statusCode: 404, message: 'Товар не найден' })
      }
    } catch(e) {
      
      return this.$nuxt.error({ statusCode: 404, message: e })
    }

  },

  computed: {
    ...mapState('settings', ['currency', 'currencyShort', 'imgPath', 'imgPrefix', 'imgRetinaPrefix' ]),
    ...mapState('token', ['session_id']),
    sale() { return this.$sale(this.data.price, this.data.oldprice) || 0},
    getVisibleSlidersCount(){
      if (process.server) return 7
      const w = window.innerWidth
      const responsive = otherSliderResponsive
      // const responsive = [
      //   { breakpoint: Infinity, slidesToShow: 6, },
      //   { breakpoint: 1600, slidesToShow: 6, },
      //   { breakpoint: 1300, slidesToShow: 5, },
      //   { breakpoint: 1100, slidesToShow: 4, },
      //   { breakpoint: 767,  slidesToShow: 7, },
      //   { breakpoint: 0,    slidesToShow: 7, },
      // ]
      let arr = responsive.filter(v => v.breakpoint > w)
      if (arr && arr.length) {
        return arr.sort((a,b) => a.breakpoint - b.breakpoint)[0].slidesToShow
      }
      return Infinity
    },
    feedbackFilterArr() { 
      return Array.from(new Array(6), (x,i) => 5 - i)
    },
    filteredFeedbacks(){
      // return this.getFilteredFeedbacks(this.feedbackFilter)
      return this.feedbackFilter.length === 0 ? this.data.feedbacks 
              : this.data.feedbacks.filter(item => this.feedbackFilter.includes(item.stars))

    },
    hasArrows(){
      return this.setHasArrows(this.data.sameart)
    },
    hasCasesArrows(){
      return this.setHasArrows(this.data.cases)
    },

    tabSizeMaxWidth(){
      if (process.browser){
        return Math.floor(document.documentElement.clientWidth * .6)
      }
      return 300
    },
    tabSizeMaxHeight(){
      if (process.browser){
        return Math.floor(document.documentElement.clientHeight * .6)
      }
      return 300
    },
  },
  beforeMount(){
    window.addEventListener('resize', this.setHasArrows)
  },
  beforeDestroy(){
    window.removeEventListener('resize', this.setHasArrows)
  },
  mounted(){
    this.$nextTick( this.$forceUpdate )
    // Добавляем размер по умолчанию в Выбранные размеры
    if (process.browser && this.data.sizes) {
      const currentSize = this.data.sizes.find(sz => sz.active && sz.ostatok)
      // if (currentSize) this.selectSize({value: currentSize, toggle:true})
      if (currentSize) this.selectedSize = currentSize
    }
    if (process.browser && this.data.cases) {
      const currentCase = this.data.cases.find(sz => sz.active )
      // if (currentSize) this.selectSize({value: currentSize, toggle:true})
      if (currentCase) this.selectedCase = currentCase
    }
    this.setHasArrows()
    if (this.$refs.productSliderThumbs) this.$refs.productSliderThumbs.goTo(0)
  },
  methods : {
    // reInit(e){console.log('reInit', e)},
    declensionEndings(v, type) {
      // type = 'otzyv' === ['отзыв','отзыва','отзывов']
      // type = 'raz' === ['раз','раза','раз']
      // type = Array(3) === [,,] Массив величин числительного v в соотв. падежах
      return `${v} ${this.$declensionEndings(v, type)}`
    },
    setHasArrows(arr) {
      return (process.browser && arr) ? this.getVisibleSlidersCount < arr.length : false
    },
    // setHasArrows() {
    //   console.log('setHasArrows')
    //   if (process.browser && this.data.sameart) {
    //     this.hasArrows = this.getVisibleSlidersCount < this.data.sameart.length
    //   }
    //   if (process.browser && this.data.cases) {
    //     this.hasCasesArrows = this.getVisibleSlidersCount < this.data.cases.length
    //   }
    // },
    feedbackFilterToggle() {
      // debugger
      if (this.feedbackFilter.length) {
        this.feedbackFilter = []
        this.feedbackFilterBtnText = this.$options.FEEDBACK.SHOW_ALL_BTN
      } else {
        this.feedbackFilterBtnText = this.$options.FEEDBACK.SHOW_CLEAR_BTN
        this.feedbackFilter = Array.from(new Array(6), (x,i) => i)
      }
    },
    imgUpdate(e){
      this.imgWidth = e.width
      this.imgHeight = e.height
    },
    getFilteredFeedbacks(v){
      return v < 0 || v > 5  
              ? this.data.feedbacks 
              : this.data.feedbacks.filter(item => item.stars === v )
    },
    tabSizesModalOpened(e) {
      const sz = getInnerSize(e.ref.$refs.vfmContent)   
      this.$refs.tabSizesModalPs.$el.style.width = sz.w + 'px'
      this.$refs.tabSizesModalPs.$el.style.height = sz.h + 'px'
      this.$refs.tabSizesModalPs.update()
    },
    // reportEmailSetValid(v) {
    //   // debugger
    //   this.reportEmailIsValid = v ? 1 : -1
    // },
    // selectSize(v) {
    //   if (v.toggle) {
    //     this.selectedSizeCount = v.value.count || 1
    //     this.selectedSize = v.value
    //   }
    // },

    async addToCart() {
      this.startAdd2Cart = true
      const val = []
      val.push({scode: this.selectedSize.scode, q: this.selectedSizeCount })
      if (this.selectedCase) {
        val.push({scode: this.selectedCase.scode, q: this.selectedSizeCount, parent_scode: this.selectedSize.scode })
      }
      console.log('addToCart val: ', val)
      const res = await this.$store.dispatch('cart/addToCart', val)
      // await this.$nuxt.refresh()
      this.startAdd2Cart = false
    },
    async addFeedback() {
      if (this.userFeedback.text.length) {
        const fb = await this.$axios.$post('/set_feedback_new', {
              session_id: this.session_id,
              otzyv: this.userFeedback.text.trim(),
              stars: this.userFeedback.stars,
              catalog_id: this.data.id,
          })
          if (fb.errors) {
            console.log('Error add feedback')
          }
          if (fb.feedback_id) {
            console.log('Success add feedback', fb.feedback_id)
          }
      }
    },
  },
  watch: {
    feedbackFilter(v) {
      this.feedbackFilterKey++
      this.feedbackFilterBtnText = v.length 
        ? this.$options.FEEDBACK.SHOW_CLEAR_BTN
        : this.$options.FEEDBACK.SHOW_ALL_BTN
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
