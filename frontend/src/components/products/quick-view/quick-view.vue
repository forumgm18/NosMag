<template lang="pug">
  .quick-view(v-if="product" ref="quickView")
    .bgr-close.quick-view-close(@click.stop.prevent="close")
    .quick-view-body(@click.stop)
      .quick-view-title {{product.name}}
      .quick-view-info
        .quick-view-info-item(
          v-for="(item, index) in info_table" 
          :key="index"
          :class="{ art: index === 0 }"
          )  
          .label {{labelFormat(item.name)}}
          .text {{item.value.trim()}}
      .quick-view-content
        .quick-view-col.slider
          .product-slider-block.thumbs
            .product-additional
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
                        img(:src="itm")

                  template( v-slot:prevArrow)
                    button.thumbs-arrow.prev
                      svg.icon.icon-arrow-default <use href="#icon-arrow-default"/>
                  template( v-slot:nextArrow)
                    button.thumbs-arrow.next
                      svg.icon.icon-arrow-default <use href="#icon-arrow-default"/>


          .product-slider-block
            .product-additional
              v-stars(:rating="product.stars || 0" )
              product-tags(:tags="labels" :pos-absolute='false')

            .product-slider
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
                      img(:src="item")

        .quick-view-col.info
          .quick-view-price-block
            span.actual {{product.price}} {{$options.RUB}}
            span.old {{product.oldprice}} {{$options.RUB_OLD}}

          product-tab-sizes(
            :sizes="product.sizes"
            :quisk-view="true"
            :selected-size="selectedSize"
            @select-size="selectSize"
            )
          .product-quantity-block(v-if="selectedSize")
            .product-quantity-label {{$options.QUANTITY_LABEL}}
            .product-quantity
              input-number(
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
                span.text {{product.delivery.info}}
              .btn() {{$options.ADD_TO_BASKET_TEXT}}
              nuxt-link.btn.btn-4(:to="`${catalogLink}${product.alias}`") {{$options.MORE_INFO_TEXT}}



</template>

<script>
import vStars from '~/components/common/stars/stars'
import productTabSizes from '~/components/products/product-tab-sizes/product-tab-sizes'
import VueSlickCarousel from 'vue-slick-carousel'
import productTags from '~/components/products/product-tags/product-tags'
import inputNumber from '~/components/common/forms/input-number/input-number'

export default {
  name: 'quick-view',
  components: {
    vStars,
    productTabSizes,
    VueSlickCarousel,
    productTags,
    inputNumber
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

  computed: {
    labels() { return this.product.labels || null},
    info_table() { return this.product.info_table || null},
    sizes() { return this.product.sizes || null},
  },
  mounted(){
    document.body.append(this.$refs.quickView)
    this.$nextTick( this.$forceUpdate )
    if (this.sizes && this.sizes.length) {
      // let i = 0
      // while (i < this.sizes.length && !this.sizes[i].active && !this.sizes[i].ostatok) i++;
      // if (i < this.sizes.length) this.selectSize({value:this.sizes[i], toggle:true})
      const currentSize = this.sizes.find(sz => sz.active && sz.ostatok)
      if (currentSize) this.selectSize({value: currentSize, toggle:true})
    }

  },
  methods: {
    close() {
      this.$emit('close-quick-view', false)
    },
    labelFormat(v) {
      let s = v.trim()
      // if (s.slice(-1, 1) != ':' ) s += ':'
      // return s
      return s.slice(-1, 1) === ':' ? s : s + ':'
    },
    selectSize(v) {
      if (v.toggle) {
        this.selectedSizeCount = v.value.count || 1
        this.selectedSize = v.value
      }
    },

  },

}
</script>

<style lang="scss" scoped>
@import "quick-view";
</style>
