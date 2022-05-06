<template lang="pug">
  client-only
    vue-final-modal(
      v-slot="{ close }"
      v-bind="$attrs"
      v-on="$listeners"
      :resize="false"
      :classes="['modal-container', 'quick-view_modal']"
      :content-class="['modal-content', 'quick-view_modal-content' ]"
      :overlay-class="['modal-overlay']"
      :fit-parent="true"
      :ssr="false"
      
      )

      template(v-if="product" ref="quickView")
        .quick-view-close(@click="close")
          svg.icon.icon-btn-close <use href="#icon-btn-close"/>
        .quick-view-body
          .quick-view-title {{product.name}}
          .quick-view-content
            .quick-view-col.slider
              .product-slider-block.thumbs
                .thumbs-layout
                  .thumbs-body
                    vue-slick-carousel(
                      v-bind="settingsProductSliderThumbs"
                      ref="productSliderThumbs"
                      :asNavFor="$refs.productSlider",
                      )
                      .thumbs-item(
                        v-for="(itm, ind ) in product.images"
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
                  .product-slider-container
                    vue-slick-carousel(
                      v-bind="settingsProductSlider"
                      ref="productSlider"
                      :asNavFor="$refs.productSliderThumbs"
                      
                        )
                      .product-slider-item(
                        v-for="(item, index ) in product.images"
                        :key="`slider-${index}`"
                        ) 
                        .product-slider-item-content
                          .img-box
                            //- img(:src="imgPath + item")
                            //- inner-image-zoom(:src="imgPath + item")
                            vue-photo-zoom-pro(
                              :url="imgPath + item"
                              :highUrl="imgPath + item"
                              :width="imgWidth"
                              :height="imgHeight"
                              @update="imgUpdate"
                              )

              resize-observer(@notify="sliderResize")
            .quick-view-col.info(:style="{ maxWidth: infoWidth }")
              .quick-view-price-block
                span.actual {{product.price}} {{$options.RUB}}
                span.old {{product.oldprice}} {{$options.RUB_OLD}}

              //- .quick-view_sale-block(v-if="data.skidka")
                .sale(v-if="data.skidka.proc") {{data.skidka.proc}}%
                .text(v-if="data.skidka.info") {{data.skidka.info}}

              //- ====== Лого производителя =======
              .quick-view_brand-block
                .quick-view_brand-logo(v-if="product.category.logo && product.category.logo.length")
                  //- .img-box
                  img(:src="product.category.logo")
                .quick-view_brand-text
                  span(v-if="product.category.manufacturer && product.category.manufacturer.length") {{product.category.manufacturer}}
                  span(v-if="product.category.country_of_origin && product.category.country_of_origin.length") {{product.category.country_of_origin}}
              //- ====== Параметры товара =========
              .quick-view_props-block
                .quick-view_row(
                  v-for="(p, i) in params"
                  :key="`param-${i}`"
                )
                  .el-label {{p.name}}:
                  .el-text {{p.value}}

              //- ============= Размер ===============
              .product-sizes-block
                .el-label {{$options.SELECT_SIZE}}
                .product-sizes-row
                  .product-sizes_tab
                    template(v-for="(tb, ind) in product.sizes")
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
              
              .product-order-block
                .product-delivery-info
                  .product-delivery-label 
                    span.label {{$options.DELIVERY_LABEL}}
                    span.text {{product.delivery.info}}
              .btn.quick-view_btn(@click="$emit('add2cart', close)") {{$options.ADD_TO_BASKET_TEXT}}
              nuxt-link.quick-view_link.link(:to="`${catalogLink}${product.alias}`") 
                span(@click="close") {{$options.MORE_INFO_TEXT}}

          resize-observer(@notify="bobyResize")


</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'  
import VuePhotoZoomPro from 'vue-photo-zoom-pro'
import 'vue-photo-zoom-pro/dist/style/vue-photo-zoom-pro.css'
import { ResizeObserver } from 'vue-resize'
import {mapState} from 'vuex'

export default {
  name: 'quick-view',
  components: {
    VueSlickCarousel,
    VuePhotoZoomPro,
    ResizeObserver
  },
  props: {
    product: {
      type: Object,
      default: null,
      required: true
    },
    catalogLink: {
      type: String,
      default: ''
    },
  },
  data: function() {
    return {
      // isOpen: false,
      imgWidth: 0,
      imgHeight: 0,
      bobySize: {}, 
      sliderSize: {},
      infoWidth: 'auto',
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
      selectedSize: null,
      selectedSizeCount: 1,
    }
  },
  RUB: 'руб.',
  RUB_OLD: 'р.',
  MORE_INFO_TEXT: 'Больше информации',
  ADD_TO_BASKET_TEXT: 'Добавить в корзину',
  DELIVERY_LABEL: 'Доставка: ',
  QUANTITY_LABEL: 'Количество:',
  AVAILABLE_LABEL: 'В наличии: ',
  SELECT_SIZE: 'Ваберите размер:',
  TAB_SIZES_REPORT: 'Сообщить о поступлении',

  computed: {
    ...mapState('settings', ['currency', 'currencyShort', 'imgPath', 'imgPrefix', 'imgRetinaPrefix' ]),
    // labels() { return this.product.labels || null},
    params() { return this.product.params ? this.product.params.filter(item => item.main) : null },
  },
  mounted(){
    this.$nextTick( this.$forceUpdate )
    const sizes = this.product.sizes
    if (sizes && sizes.length) {
      const currentSize = sizes.find(sz => sz.active && sz.ostatok)
      if (currentSize) {
        this.selectedSizeCount = currentSize.count || 1
        this.selectedSize = currentSize
      }
    }
  
  },
  methods: {
    imgUpdate(e){
      this.imgWidth = e.width
      this.imgHeight = e.height
    },

    bobyResize({width, height}){
      this.bobySize = {w: width, h: height} 
      this.infoWidth = this.bobySize.w - this.sliderSize.w + 'px'
    },
    sliderResize({width, height}){
      this.sliderSize = {w: width, h: height}
      this.infoWidth = this.bobySize.w - this.sliderSize.w + 'px'
    },

    // labelFormat(v) {
    //   let s = v.trim()
    //   return s.slice(-1, 1) === ':' ? s : s + ':'
    // },
    // selectSize(v) {
    //   if (v.toggle) {
    //     this.selectedSizeCount = v.value.count || 1
    //     this.selectedSize = v.value
    //   }
    // },
  },
  watch: {
    selectedSize(val) {
      if ( this.selectedSizeCount > val.ostatok) this.selectedSizeCount = val.ostatok
      this.$emit('selectedSize', {size: val, count: this.selectedSizeCount})
    },
    selectedSizeCount(val) {
      if ( this.selectedSize.ostatok < val) this.selectedSizeCount = val
      this.$emit('selectedSize', {size: this.selectedSize, count: val})
    }
  }
}
</script>

<style lang="scss" >
@import "quick-view";
//  .product-slider.proportional {
//    position: relative;
//    padding-bottom: 100%;
//  }
//  .product-slider-img-box {
//    position: absolute;
//    width: 100%;
//    height: 100%;
//    z-index: 1; 
//  }
//  .product-slider-container {
//    border: 1px solid red;
//    width: 100%;
//    height: 100%;

//    .slick-slider {height: 100%;}
//    .slick-list {height: 100%;}
//    .slick-track {height: 100%;}
//    .slick-slide {
//      height: 100%;
//      > div {height: 100%;}
//    }
//    .product-slider-item {height: 100%;}
   
//  }
</style>
