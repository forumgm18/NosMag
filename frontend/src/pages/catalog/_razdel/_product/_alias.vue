<template lang="pug">
  main.container(v-if="content")
    section
      v-breadcrumbs(v-if="breadcrumbs"  :items="breadcrumbs")
    loading.center(v-if="loading")
    section.content-section.product-page(v-else)
      .product-page-column.slider
        .product-page-row
          .product-slider-block.thumbs
            .product-additional
            .thumbs
              vue-slick-carousel(
                id="product-slider-thumbs"
                v-bind="settingsProductSliderThumbs"
                ref="c2"
                :asNavFor="$refs.c1"
                :focusOnSelect="true"
              )
                .thumbs-item(
                  v-for="(itm, ind ) in content.images"
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
                .product-feedbacks {{feedBack}} 


                v-stars(:rating="content.stars || 0" )
              

            .product-slider
              vue-slick-carousel(
                id="product-slider"
                v-bind="settingsProductSlider"
                ref="c1"
                :asNavFor="$refs.c2"
                :focusOnSelect="true"
              )
                .product-slider-item(
                  v-for="(itm, ind ) in content.images"
                ) 
                  .product-slider-item-content
                    .img-box
                      img(:src="itm")



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

      
      .product-page-column
        h1.product-title {{title}}
        .product-page-price-block
          .actual {{content.price}} {{$options.RUB}}
          .old {{content.oldprice}} {{$options.RUB}}
        .product-info-block
          .product-info-row(
            v-for="p in content.params"
            :key="p.main"
          )
            .product-info-label {{p.name}}:
            .product-info-text {{p.value}}


      


  
</template>
<script>
import vLoading from '~/components/common/preloader/preloader'
import vBreadcrumbs from '~/components/common/breadcrumbs/breadcrumbs'
import vStars from '~/components/common/stars/stars'
import VueSlickCarousel from 'vue-slick-carousel'

export default {
  components:{
    vLoading,
    vBreadcrumbs,
    vStars,
    VueSlickCarousel,
  },
  data: () => ({
    loading: false,
    settingsProductSlider: {
      dots: false,
      arrows: false,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
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

    },
  }),
  RUB: 'руб.',
  asyncData: async function ({store, params}) {
    // console.log('catalog/_razdel/product/_alias params', params)
    await store.dispatch('fetchContent', params.alias)
  },
  computed: {
    feedBack() {
      if (this.content) {
        return `${this.content.otzyvov} отзывов`
      }
    },
    sale() { return this.$sale(this.content.price, this.content.oldprice) || 0},
    // ...mapGetters('razdel',['products', 'page', 'pageCount']),
    // ...mapGetters('settings',['sortmodes']),
    title() {return this.$store.state.content.data.name || ''},
    content() { return this.$store.getters['getContentData'] || null},
    // products() { return this.$store.state.content.data.items || null},
    // filters() { return this.$store.state.content.data.filters || null},
    breadcrumbs() {return this.$store.getters['getBreadcrumbs']},
  },


}

</script>

<style lang="scss">
@import "product-page";
</style>
