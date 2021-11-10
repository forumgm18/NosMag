<template lang="pug">
  loading( v-if="$fetchState.pending")
  main.has-filter(v-else)
    section.container.base-bgr-color
      breadcrumbs

      h1.page-title.mb-0
        a.btn.btn-back(href="#")
          svg.icon <use href="#icon-arrow-back"></use>
        span {{prod.name}}

    .container.product-detail
      .product-left
        .product-title-info
          span.vendor-code #[span.label Артикул] {{prod.art}}
          stars(:rating="prod.stars")
          a(href="#") {{prod.otzyvov}} отзывов
          span.label Купили #[span {{prod.kupili}}] раз
        .product-slider-block
          tiny-slider-product(:slides="prod.images" :thumb="prod.images_small")

        .product-info
          .product-info-title
            h2 О товаре
            nuxt-link.developer-link(v-if="prod.category.logo.length" :to="`/${prod.category.alias}`" )
              img(:src="prod.category.logo")
          .product-info-total
            .product-info-total-row(v-for="param in prod.params" :key="param.id"  )
              span {{param.name}}
              span {{param.value}}
          .product-info-descr(:class="{open : descrIsOpen}")
            .product-info-descr-text(v-html="prod.info_html")
            .product-info-descr_show-more(@click="descrOpenToggle")
              svg.icon <use href="#icon-arrow-down"></use>
              span Развернуть описание
              span Скрыть описание


      .product-right
        .product-sale-block(v-if="prod.prices_table" :class="{open: saleBlockIsOpen}")
          span(data-sale-tab-toggle) Цена снижается от общего количества пар носков в корзине: мужских, женских детских
          a.btn.btn-transparent(href="#" @click.prevent="saleBlockOpenToggle") Больше пар, больше скидка!
          .product-sale-tab(v-if="prod.prices.length")
            .product-sale-tab_row
              span Пары:
              span.dot
              span Цена:
              span.dot
              span Скидка:
            .product-sale-tab_row(v-for="(p, i) in prod.prices" )
              span {{p.info}}
              span.dot
              span {{p.price}} &#8381;
              span.dot
              span {{p.sale}}%

        .product-price-block(v-if="!prod.prices_table")
          .product-price
            span.ot(v-if="prod.prices_table") от
            span {{prod.price}} &#8381;

          .product-price-sale(v-if="(prod.price != prod.oldprice)" )
            span.old {{prod.oldprice}} &#8381;
            span ( скидка -{{prod.sale}}% )
        .product-params
          .product-params-row(v-for="param in prod.params" :key="param.id"  )
            span {{param.name}}
            span {{param.value}}

        .product-other-color-block
          //.product-other-color_title Или выберите другой цвет:xxx
          //.product-other-color(v-if="prod.sameart.length" )
            label.product-other-color-item(v-for="item in prod.sameart" :key="item.id" :title="`${item.name} (${item.comment})`")
              input(type="checkbox" :name="item.name" hidden)
              span.img-box
                img(:src="item.image" :alt="`${item.name} (${item.comment})`")

          //vue-scrollbar(v-if="prod.sameart.length" ref="Scrollbar")
          vue-custom-scrollbar.scroll-area( :settings="settings")
            .product-other-color(v-if="prod.sameart.length")
              nuxt-link.product-other-color-item(
                v-for="item in prod.sameart"
                :key="item.id"
                :title="`${item.name} (${item.comment})`"
                :to="`/catalog/${item.alias}`"
              )
                span.img-box
                  img(:src="item.image" :alt="`${item.name} (${item.comment})`")


        .product-quantity
          .product-quantity-title
            span
              a(href="#" @click.prevent="$modal.show('tab-size')") Таблица размеров
          .product-quantity-row(v-for="(s, i) in prod.sizes" )
            div
              span {{s.name}}
              quantity(v-model="s.count" :max="s.ostatok")
            span (осталось {{s.ostatok}} пар)
        .product-btn-block
          a.btn.btn-secondary(href="#") В КОРЗИНУ
        .product-info
          .product-info-title
            h2 О товаре
            nuxt-link.developer-link(v-if="prod.category.logo.length" :to="`/${prod.category.alias}`" )
              img(:src="prod.category.logo")
          .product-info-descr(:class="{open : descrIsOpen}")
            .product-info-descr-text(v-html="prod.info_html")
            .product-info-descr_show-more(@click="descrOpenToggle")
              svg.icon <use href="#icon-arrow-down"></use>
              span Развернуть описание
              span Скрыть описание

    .reviews
      .reviews-title
        span Отзывы
        span.rating.average
          span.average-point
            span {{reviewsRating}}
            span /5

          stars(:rating="reviewsRating")
          span.average-total {{prod.feedbacks.length}}
      review-item(v-for="(f, i) in prod.feedbacks" :key="f.id" :review="f" v-if="( i < reviewsMax)")
      .reviews-footer
        a(href="#" @click.prevent="showReviewsToggle") {{showReviewsText}}
        a(href="#") Написать отзыв


</template>

<script>
import breadcrumbs from '~/components/common/breadcrumbs'
// import SwiperProduct from '~/components/common/swiper-product'
import TinySliderProduct from '~/components/common/tiny-slider-product'
import quantity from '~/components/common/quantity'
import stars from '~/components/common/stars/stars'
import ReviewItem from '~/components/reviews/review-item'
import sale from '~/utils/sale'

// import VueScrollbar from 'vue2-scrollbar'
// import Loading from "../../components/common/loading";
// import Loading from '~/components/common/loading.vue'

import vueCustomScrollbar from 'vue-custom-scrollbar'
import "vue-custom-scrollbar/dist/vueScrollbar.css"

export default {
  components: {breadcrumbs, TinySliderProduct, quantity, stars, ReviewItem,
    // VueScrollbar
    vueCustomScrollbar
  },
  // validate({params}) {
  //   return /^\d+$/.test(params.id)
  // },
  async fetch() {
    // ctx.app.components.NuxtLoading.methods.start()
    const p = await this.$axios.$get('https://nosmag.ru/api/get_content',{
      params: {
        alias: this.$route.params.alias,
        session_id: this.$store.getters.getSessionId,
      }
    })

    if (p.type === 'catalog') this.prod = await p.data
    this.prod.sale = sale(this.prod.price, this.prod.oldprice)

    if (this.prod.prices && this.prod.prices.length) this.prod.prices.forEach(el => el.sale = sale(el.price, this.prod.price))

    this.prod.sizes.forEach(el => {
      el.count = 0
      el.ostatok = parseInt(el.ostatok, 10)
    })
    console.log(this.prod)
    // console.log(this.prod.params)
    // console.log(this.prod.sizes)
    // return { prod }
    // ctx.app.components.NuxtLoading.methods.stop()
    this.loading = false
  },
  data: () => ({
    loading: false,
    prod: null,
    reviewsShowDefault: 2,
    reviewsMax: 0,
    descrIsOpen: false,
    // saleBlockIsOpen: false,
    saleBlockIsOpen: true,
    settings: {
      suppressScrollY: true,
      suppressScrollX: false,
      wheelPropagation: false
    }
  }),
  computed: {
    reviewsRating() {
      const r = this.prod.feedbacks
      if (r && r.length === 0) return 0
      const sum = r.reduce((s, item) => s + parseInt(item.stars,10), 0)
      return Math.floor(sum / r.length)
    },
    showReviewsText() {
      return this.showReviewsAll() ? 'Скрыть отзывы' : 'Показать все отзывы'
    },
  },
  mounted() {
    this.reviewsMax = this.reviewsShowDefault
  },
  methods: {
    descrOpenToggle() { this.descrIsOpen = !this.descrIsOpen},
    saleBlockOpenToggle() { this.saleBlockIsOpen = !this.saleBlockIsOpen},
    showReviewsToggle() {
      this.reviewsMax = this.showReviewsAll() ? this.reviewsShowDefault : this.prod.feedbacks.length
    },
    showReviewsAll() { return this.reviewsMax > this.reviewsShowDefault && this.prod.feedbacks.length > this.reviewsShowDefault}


  }
}
</script>

<style lang="scss" >
.product-other-color {
  @include media-max-width2(768) { width: fit-content; }
}
.product-other-color-item {
  @include media-max-width2(768) { width: initial; }
}
.product-other-color-block {
  .scroll-area {
    margin: 0 -10px;
    padding: 0 10px;
  }
  .ps__rail-x {
    @include media-min-width2(769) { display: none !important; }
  }
}


</style>
