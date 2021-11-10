<template lang="pug">
  .product-slider-block
    vue-slick-carousel.product-slider(
      id="product-slider"
      v-bind="settingsSlider"
      ref="c1"
      :asNavFor="$refs.c2"
      :focusOnSelect="true"
      )
      .product-slider-item(v-for="(image, i) in slides")
        div.product-slider-img
          inner-image-zoom(:src="image" :zoomSrc="image" :fullscreen="true")
          //img(:src="image" alt="")

      template( v-slot:prevArrow)
        button.product-slider-arrow
          svg.icon.icon-left <use href="#icon-left"></use>
      template( v-slot:nextArrow)
        button.product-slider-arrow
          svg.icon.icon-right <use href="#icon-right"></use>

    vue-slick-carousel.product-slider-thumb(
      id="product-slider-thumbnails"
      ref="c2"
      :asNavFor="$refs.c1"
      :slidesToShow="6"
      :focusOnSelect="true")
      .product-slider-thumb-item(v-for="(image, i) in thumb")
        div.product-slider-thumb-img
          img(:src="image" alt="")
</template>

<script>
import InnerImageZoom from 'vue-inner-image-zoom'
import 'vue-inner-image-zoom/lib/vue-inner-image-zoom.css'

import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
  name: 'swiper-product',
  components: { VueSlickCarousel, InnerImageZoom },
  props:['slides', 'slidesZoom', 'thumb'],
  data: () => ({
    settingsSlider: {
      dots: false,
      // "dotsClass": "slick-dots custom-dot-class",
      arrows: true,
      edgeFriction: 0.35,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      // focusOnSelect: true,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            dots: true
          }
        },
      ]
    },
    loading: true
  }),
  mounted() {
    // this.loading = false
    this.$nextTick(this.$forceUpdate)
  },
}
</script>

<style lang="scss" scoped>
</style>
