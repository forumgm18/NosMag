<template lang="pug">
  div
    pre-loader.in-page(v-if="$fetchState.pending")
    main.main-page(v-else)
      section.main-top-section
        .container
          vue-slick-carousel.main-slider(
            id="product-slider"
            v-bind="settingsTopSlider"
            ref="c1"
            :asNavFor="$refs.c2"
            :focusOnSelect="true"
          )
            .main-slider-item
              div.main-slider-content Рекламный баннер 100
            .main-slider-item
              div.main-slider-content Рекламный баннер 2
            .main-slider-item
              div.main-slider-content Рекламный баннер 3

            template( v-slot:prevArrow)
              button.main-slider-arrow.prev
            template( v-slot:nextArrow)
              button.main-slider-arrow.next



          .main-tile(v-if="links")
            //- nuxt-link.main-tile-item(v-for="(lnk, iLnk) in links" :to="`catalog/${lnk.link}`")
            nuxt-link.main-tile-item(v-for="(lnk, iLnk) in links" :to="`/${lnk.link}`")
              .main-tile-item-img
                .img-box.hover
                  .button-select {{$options.SELECT_LINK_TEXT}}
                .img-box
                  picture
                    source( media="(min-width: 993px)" :srcset="`${lnk.images.xl}, ${lnk.images.xl_x2} x2`")
                    source( media="(max-width: 992px)" :srcset="`${lnk.images.lg}, ${lnk.images.lg_x2} x2`")
                    source( media="(max-width: 576px)" :srcset="`${lnk.images.sm}, ${lnk.images.sm_x2} x2`")
                    img(:src="lnk.images.sm" :alt="lnk.name")
              .main-tile-item-title {{lnk.name}}



      section.main-popular.container
        h2.main-section-title {{$options.SECTION_POPULAR_TITLE}}
        vue-slick-carousel.main-popular-slider(
          v-if="showcase"
          id="main-popular-slider"
          v-bind="settingsPopularSlider"
          ref="c1"
          :asNavFor="$refs.c2"
          :focusOnSelect="true"
        )

          product-card(
            v-for="prod of showcase"
            :key="prod.id"
            :product="prod"
            :is-btn="false"
            :is-sizes="false"  )
          //div( v-for="(prod, i) of showcase" :key="prod.id") {{i}}
          template( v-slot:prevArrow)
            button.main-popular-slider-arrow.prev
          template( v-slot:nextArrow)
            button.main-popular-slider-arrow.next



      section.main-popular.container
        h2.main-section-title {{$options.SECTION_LINK1_TITLE}}
        .main-tile(v-if="links1")
          //- nuxt-link.main-tile-item(v-for="(lnk1, iLnk1) in links1" :to="`catalog/${lnk1.link}`")
          nuxt-link.main-tile-item(v-for="(lnk1, iLnk1) in links1" :to="`/${lnk1.link}`")
            .main-tile-item-img
              .img-box.hover
                .button-select {{$options.SELECT_LINK_TEXT}}
              .img-box
                picture
                  source( media="(min-width: 993px)" :srcset="`${lnk1.images.xl}, ${lnk1.images.xl_x2} x2`")
                  source( media="(max-width: 992px)" :srcset="`${lnk1.images.lg}, ${lnk1.images.lg_x2} x2`")
                  source( media="(max-width: 576px)" :srcset="`${lnk1.images.sm}, ${lnk1.images.sm_x2} x2`")
                  img(:src="lnk1.images.sm" :alt="lnk1.name")
            .main-tile-item-title {{lnk1.name}}



      section.main-reclama.container
        .main-slider-item
          div.main-slider-content Рекламный баннер


</template>

<script>
// import ProductList from '~/components/products/product-list/product-list'
import preLoader from '~/components/common/preloader/preloader'
import ProductCard from '~/components/products/product-card/product-card'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
  components: { 
    preLoader,
    VueSlickCarousel,
    ProductCard,
    // ProductList
  },
  // props: ['showcase'],
  data: function () {
    return {
      // content: null
      settingsTopSlider: {
        dots: true,
        dotsClass: "slick-dots main-slider-dots",
        arrows: true,
        edgeFriction: 0.35,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        // focusOnSelect: true,
      },
      settingsPopularSlider: {
        dots: false,
        // dotsClass: "slick-dots main-slider-dots",
        arrows: true,
        edgeFriction: 0.35,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        // focusOnSelect: true,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 4,
            }
          },
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
            }
          }
        ]
      },
      loading: true
    }
  },
  SELECT_LINK_TEXT: 'Выбрать',
  SECTION_POPULAR_TITLE: 'Популярное',
  SECTION_LINK1_TITLE: 'Узнайте больше',
  // asyncData: async function ({app, store, params, error}) {
  //   // this.loading = true
  //   await store.dispatch('fetchContent', params.alias || '')
  //   if (app.$contentError(store.state.content.type)) error({ statusCode: 404, message: '' })
  //   // this.loading = false
  // },
  // async fetch({app, store, params, error}) {
  async fetch() {
    // console.log('route: ', this.$route )
    // this.loading = true
    // await store.dispatch('fetchContent', params.alias || '')
    await this.$store.dispatch('fetchContent', this.$route.params.alias || '')

    // if (app.$contentError(store.state.content.type)) error({ statusCode: 404, message: '' })
    if (this.$contentError(this.$store.state.content.type)) error({ statusCode: 404, message: '' })
    // this.loading = false
  },

  computed: {
    content: s => s.$store.getters['getContentData'],
    showcase() { return this.content.showcase},
    links() { return this.content.hasOwnProperty('links') ? this.content.links : undefined},
    links1() { return this.content.hasOwnProperty('links1') ? this.content.links1 : undefined},
  },

  mounted() {
    if (process.browser) {
      const rootSection = document.querySelector('[data-root-section]')
        if (rootSection) rootSection.classList.add('main-page')
    }
  },
  methods: {
    async checkToken() {
      let token = this.$storage.getLocalStorage('token')
      console.log('token: ', token)
      if (token && token.session_id.length > 0) {
        console.log('token (if)')
        token.sessionDate = new Date()
        await this.$store.commit('token/setToken', token)
      } else {
        console.log('token (else)')
        token = await this.$store.dispatch('token/setNewToken')
        this.$storage.setLocalStorage('token', this.token)
      }

    }
  }

}
</script>

<style lang="scss">
@import 'main-page';
.main-popular-slider .slick-slide {padding: 0 30px;}

/*.product-card {*/
/*  !*border: 1px solid red;*!*/
/*  !*padding: 16px;*!*/
/*  &:hover {*/
/*    box-shadow: none;*/
/*    border-radius: 0;*/
/*    .product-item-base {*/
/*      box-shadow: 0px 4px 16px rgb(85, 85, 85, .25);*/
/*      border-radius: var(--border-radius);*/
/*    }*/

/*  }*/
/*  &-base {*/
/*    padding: 10px;*/
/*  }*/
/*  &-btn-panel {display: none}*/
/*}*/
</style>
