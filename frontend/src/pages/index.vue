<template lang="pug">
  div
    v-preloader.in-page(v-if="$fetchState.pending")
    main.container.main-page(v-else)
      section.main-top-section
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



      section.main-tile(v-if="links")
        nuxt-link.main-tile-item(v-for="(lnk, iLnk) in links" :key="iLnk" :to="`catalog/${lnk.link}`")
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



      section.main-popular(v-if="showcase")
        h2.main-section-title {{$options.SECTION_POPULAR_TITLE}}
        vue-slick-carousel.main-popular-slider(
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
            :is-sizes="false"
            )
          template( v-slot:prevArrow)
            button.main-popular-slider-arrow.prev
          template( v-slot:nextArrow)
            button.main-popular-slider-arrow.next



      section
        h2.main-section-title {{$options.SECTION_LINK1_TITLE}}
        .main-tile(v-if="links1")
          nuxt-link.main-tile-item(v-for="(lnk1, iLnk1) in links1" :key="iLnk1" :to="`catalog/${lnk1.link}`")
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



      section.main-reclama
        .main-slider-item
          div.main-slider-content Рекламный баннер


</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
  name: 'main-page',
  components: { 
    VueSlickCarousel,
  },
  data() {
    return {
      data: {},
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
        centerMode: true,
        centerPadding: '10px',        
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
          // {
          //   breakpoint: 480,
          //   settings: {
          //     slidesToShow: 1,
          //   }
          // }
        ]
      },
      loading: true
    }
  },
  SELECT_LINK_TEXT: 'Выбрать',
  SECTION_POPULAR_TITLE: 'Популярное',
  SECTION_LINK1_TITLE: 'Узнайте больше',
  async fetch() {
    try {
      this.$store.commit('setBreadcrumbs', [])
      const c = await this.$axios.$get(`/get_content`, {
        params: {
          alias: '',
          session_id: this.$store.state.token.session_id
        }
      })
      // return this.$nuxt.error({ statusCode: 404, message: c })
      if (c.status === 'ok' && c.type != '404' && c.type != '505') {
        // Преобразуем строковые числа в числа
        const content = this.$parseJsonStrToNumbers(c)
        // Добавляем полученные данные в data
        // цикл по ключам и значениям
        for (let [key, v] of Object.entries(content.data)) {
          if ( key==='breadcrumbs') { // Коммитим Крошки в $store
            this.$store.commit('setBreadcrumbs', v)
          } else { // Добавляем поле в data
            this.data[key] = v
          }
        }

      } else {
        return this.$nuxt.error({ statusCode: 404, message: 'Страница не найдена' })
      }
    } catch(e) {
      
      return this.$nuxt.error({ statusCode: 404, message: e })
    }
  },

  head() {
    return {
      title: this.data && this.data.title || 'Главная',
      meta: [
        { hid: 'description', name: 'description', content: this.data && this.data.description || 'Главная' }
      ]
    }
  },

  computed: {
    showcase() { 
      return this.data.showcase
    },
    links() { 
      return this.data.links
    },
    links1() { 
      return this.data.links1
    },
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
// .main-popular-slider .slick-slide {padding: 0 30px;}

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
