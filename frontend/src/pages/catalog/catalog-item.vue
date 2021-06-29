<template lang="pug">
  //loading( v-if="$fetchState.pending")
  main.has-filter
    section.container.page-title-section.base-bgr-color
      breadcrumbs(:items="prod.breadcrumbs")

      h1.page-title.mb-0
        btn-go-back(:link="btnBackLink")
        span {{prod.name}}

    section.container.product-detail
      .product-left
        .product-title-info
          span.vendor-code #[span.label Артикул] {{prod.art}}
          stars(:rating="prod.stars")
          a(href="#") {{prod.otzyvov}} отзывов
          span.label Купили #[span {{prod.kupili}}] раз

        slick-slider-product(
          :slides="prod.images"
          :slidesZoom="prod.images"
          :thumb="prod.images_small"
          )

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
                :class="{current: item.alias === prod.alias}"
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
              quantity-size(
                :value="s"
                :id="i"
                v-on:input="qtyInput")
            span (осталось {{s.ostatok}} шт.)
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
    reviews(:feedbacks="prod.feedbacks")

</template>

<script>
import breadcrumbs from '~/components/common/breadcrumbs'
import QuantitySize from '~/components/common/quantity-size'
import stars from '~/components/common/stars'
import Reviews from '~/components/reviews/reviews'
import vueCustomScrollbar from 'vue-custom-scrollbar'
import 'vue-custom-scrollbar/dist/vueScrollbar.css'
import SlickSliderProduct from '~/components/common/slick-slider-product'

export default {
  name: 'CatalogItem',
  props: ['prod'],
  components: {breadcrumbs, SlickSliderProduct, QuantitySize, stars, Reviews,
    vueCustomScrollbar
  },
  data: () => ({
    loading: false,
    // prod: null,
    // reviewsShowDefault: 2,
    // reviewsMax: 0,
    descrIsOpen: false,
    // saleBlockIsOpen: false,
    saleBlockIsOpen: true,
    settings: {
      suppressScrollY: true,
      suppressScrollX: false,
      wheelPropagation: false
    },
    // refreshTinySlider: 0
  }),
  computed: {
    btnBackLink() {
      const crumbs = this.prod.breadcrumbs
      const ali = crumbs.slice(-2)[0]
      console.log('ali: ', ali)
      return crumbs.slice(-2)[0].alias
    }
  },
  mounted() {
    if (process.browser) {
      const rootSection = document.querySelector('[data-root-section]')
      if (rootSection) rootSection.classList.add('product-page')
    }

  },
  methods: {
    descrOpenToggle() { this.descrIsOpen = !this.descrIsOpen},
    saleBlockOpenToggle() { this.saleBlockIsOpen = !this.saleBlockIsOpen},
    qtyInput(val) { this.$store.dispatch('setQuantity',val) },
  }
}
</script>

<style lang="scss" >
.product-page {
  .page-title-section {padding-top: 2em}
  .page-title {
    line-height: 1;
    display: block;

      .btn-back {
        display: flex;
        width: fit-content;
        /*margin-top: .3em;*/
        margin-bottom: .3em;
        font-size: inherit;
          span {
            font-size: .4em;
            margin-right: 1.15em;
          }
      }
  }
}
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
