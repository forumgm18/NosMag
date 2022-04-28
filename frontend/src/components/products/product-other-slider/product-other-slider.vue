<template lang="pug">
  .product-other-slider(
    ref="rootEl"
    v-if="items.length"
    :class="{ 'has-arrows': hasArrows }"
    )
    vue-slick-carousel(
      v-bind="settingsProductOtherSlider"
      ref="Slider"
      @reInit="getElementsWidth"
      )
      .other-slider-item(
        ref="sliderSlide" 
        v-for="(cs, i ) in items" :key="`cs-${i}`" 
        :class="{ current: isCurrent(cs), 'not-available': isCases && !cs.active}"
        ) 
        nuxt-link.other-slider-item-content(
          v-if="isLink"
          :to="cs.alias"
          :title="cs.comment"
          )
          .img-box
            img(:src="imgPath + cs.photo")  
        label.other-slider-item-content(v-else)
          input(type="radio" hidden v-model="model" :value="cs")
          .img-box
            img(:src="imgPath + cs.photo")  

      template(#prevArrow)
        button.slider-arrow
          svg.icon.icon-slider-arrow <use href="#icon-slider-arrow"/>
      template(#nextArrow)
        button.slider-arrow
          svg.icon.icon-slider-arrow <use href="#icon-slider-arrow"/>

</template>

<script>
  import {mapState} from 'vuex'
  import VueSlickCarousel from 'vue-slick-carousel'
  import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'  
  export default {
    name: 'product-other-slider',
    props: {
      items: {
        type: Array,
        default() { return []}
      },
      isLink: {
        type: Boolean,
        default: true
      },
      currentClassField: {
        type: String,
        default: 'alias'
      },
      currentAlias: {
        type: String,
        default: ''
      },
      isCases: {
        type: Boolean,
        default: false
      },

      value: {}

    },
    components: {VueSlickCarousel},
    data(){
      return {
        settingsProductOtherSlider: {
          // lazyLoad: 'ondemand',
          dots: false,
          arrows: true,
          infinite: true,
          infinite: false,
          variableWidth: true,
          // slidesToShow: 6,
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 1,
          // centerMode: true,
          // centerPadding: '0',
          // responsive: [
          //   {
          //     breakpoint: 1600,
          //     settings: {
          //       slidesToShow: 6,
          //     }
          //   },
          //   {
          //     breakpoint: 1300,
          //     settings: {
          //       slidesToShow: 5,
          //     }
          //   },
          //   {
          //     breakpoint: 1100,
          //     settings: {
          //       slidesToShow: 3,
          //     }
          //   },
          //   {
          //     breakpoint: 767,
          //     settings: {
          //       slidesToShow: 7,
          //     }
          //   },
          // ]


        },
        slideWidth: 0,
        rootElWidth: 0,
      }
    },
    computed: {
      ...mapState('settings', ['imgPath', 'imgPrefix', 'imgRetinaPrefix' ]),
      model: {
        get() {return this.value},
        set(v) {this.$emit('input', v)},
      },
      hasArrows() {
        // return (this.rootElWidth / this.slideWidth) < this.items.length
        // let w = this.$refs.sliderSlide.clientWidth
        return (this.rootElWidth / this.slideWidth) < this.items.length
      },
      // rootElWidth() {
      //   return this.$refs.rootEl.clientWidth
      //   // return process.browser ? parseFloat(window.getComputedStyle(this.$refs.rootEl).width) : 0
      // }
    },
    mounted() {
      this.model = this.value
      // this.$nextTick(this.$forceUpdate)
      // this.getElementsWidth()
    },
    beforeMount() {
      window.addEventListener('resize', this.getElementsWidth)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.getElementsWidth)
    },
    methods: {
      getElementsWidth() {
        this.rootElWidth = this.$refs.rootEl ? this.$refs.rootEl.clientWidth : 0
        this.slideWidth = this.$refs.Slider ? this.$refs.Slider.$el.querySelector('.slick-active').offsetWidth : 0
      },
      isCurrent(v) {
        if (this.isLink){
          return this.currentAlias === v[this.currentClassField]
        } else {
          return this.model && this.model[this.currentClassField] && this.model[this.currentClassField] === v[this.currentClassField]
        }  
      }
    }
  }
</script>

<style lang="scss" >
  .not-available {
    pointer-events: none;
    opacity: .5;
  }
  .product-other-slider{
      --padding-for-arrow : 1.2rem;
      --item-size: 5rem;
      --item-visible-count: 6;
      position: relative;  
      // width: fit-content;
      width: 100%;
      // max-width: calc((var(--item-size) + .5rem) * var(--item-visible-count));
      height: var(--item-size);

      // .slick-slide {
      //   max-width: 107px;
      // }
      // &.hide {
      //   .other-slider-arrow {display: none;}
      // }
      // .slick-slide {border: 1px solid red;}
      // .slick-track {display: flex!important;}
      &.has-arrows {
        // max-width: calc(var(--item-size) * var(--item-visible-count) + .5rem * (var(--item-visible-count) - 1 ) + 2 * var(--padding-for-arrow));
        
        padding-left: var(--padding-for-arrow);
        padding-right: var(--padding-for-arrow);

      }    
      .slick-slider {
        height: 100%;
      }
      .slick-prev {
        left: calc( -1 * var(--padding-for-arrow) );
      }
      .slick-next{
        right: calc( -1 * var(--padding-for-arrow) );
      }


    }

</style>