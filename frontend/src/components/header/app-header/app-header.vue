<template lang="pug">
  header(v-if="header" data-header)
    .header
      .container
        //-.header-block

        .header-row.top
          .header-menu-block
            menu-top

          nuxt-link.header-logo(to="/")
            svg.icon.icon-logo <use href="#icon-logo"/>

          .header-search(data-header-search-panel)
            .header-search-input
              input(type="text" name="headerSerch" :placeholder="header.search.placeholder")
              span.header-loupe
                svg.icon.icon-loupe <use href="#icon-loupe"/>

          .header-phone-block
            v-dropdown( theme="header_menu" popper-class="header-phone-block_popup-container" )
              .header-link.header-feedback
                svg.icon.icon-phone <use href="#icon-phone"/>
                span.header-link_text.desktop обратный звонок
                span.header-link_text.tablet телефон

              template(#popper)
                .header-feedback-popup
                  v-popup-input-form(v-model="inputPhone" v-on:close-popup="closeFeedbackPopup")
                    template( v-slot:default)
                      p Не нашли нужной информации?
                      p Оставьте свой номер, мы перезвоним вам в рабочее время
                    template( v-slot:description)
                      p.live-chat-text Либо напишите вопрос ниже справа в live-чат


            .header-phone
              a.header-phone-link(:href="header.phone.link") {{header.phone.name}}
              .header-phone-label {{header.phone.info}}

          nuxt-link.header-link.column.delivery(:to="`/${header.dostavka.alias}`" )
            svg.icon.icon-box <use href="#icon-box"/>
            span.header-link_text {{header.dostavka.name}}

          top-basket(:cart="header.cart")
          login-form(:title="header.auth.name")  

        .header-row.bottom
          //- .header-menu-block.burger
          //- nuxt-link.header-link.oplata(:to="`/${header.oplata.alias}`" )
            svg.icon.icon-pay <use href="#icon-pay"/>
            span {{header.oplata.name}}

          //- nuxt-link.header-link.delivery(:to="`/${header.dostavka.alias}`" )
            svg.icon.icon-box <use href="#icon-box"/>
            span {{header.dostavka.name}}
          //- .header-info-block    
            v-dropdown( theme="header_menu" popper-class="popup-header-container" )
              .header-link.learn-more( @click.prevent="showTopInfoPopup")
                svg.icon.icon-learn-more <use href="#icon-learn-more"/>
                span.desktop {{header.info.header}}
                span.tablet {{header.info.header_m}}
              template(#popper)
                nuxt-link.header-info-link(
                  v-for="(lnk, l) in header.info.links"
                  :key="l"
                  :to="`/${lnk.alias}`"
                  @click.native="closeTopInfoPopup(false)"
                ) {{lnk.name}}


          //- nuxt-link.header-link.location(to="#" :data-selectes-city-id="header.city.id")
            svg.icon.icon-location <use href="#icon-location"/>
            span(v-if="header.city.name" ) {{header.city.name}}
            span(v-else) ваш город
          
          //- v-city-select(v-model="header.city")  
          v-city-select(:value="header.city")  



    .header-mobile-fixed
      nuxt-link.header-link.home(to="/" )
        svg.icon.icon-home <use href="#icon-home"/>

      .menu-bottom-mobile(@click="menuBottomMobileToggle")
        svg.icon.icon-menu <use href="#icon-menu"/>
      .header-info-block
        .header-link.learn-more( @click.prevent="showBottomInfoPopup")
          svg.icon.icon-learn-more <use href="#icon-learn-more"/>
          span {{header.info.header}}
        v-app-popup.popup-up(v-model="bottomInfoPopup" v-on:close-popup="closeBottomInfoPopup")
          nuxt-link.header-info-link(
            v-for="(lnk, l2) in header.info.links"
            :key="l2"
            :to="`/${lnk.alias}`"
            @click.native="closeBottomInfoPopup(false)"
            ) {{lnk.name}}


      div.header-phone-block
        .header-link.header-feedback( @click.prevent="showFeedbackPopup")
          svg.icon.icon-phone <use href="#icon-phone"/>
          span обратный звонок
        v-app-popup.header-feedback-popup.popup-up.call-phone(
          v-model="feedbackPopup" 
          v-on:close-popup="closeFeedbackPopup"
        )
          a.popup-phone-link(:href="header.phone.link")
            svg.icon.icon-phone <use href="#icon-phone"/>
            span {{`Вызов ${header.phone.name}`}}
          v-popup-input-form.mobile(v-model="inputPhone" v-on:close-popup="closeFeedbackPopup")
            template( v-slot:default)
              p Оставьте свой телефон для обратной связи
            template( v-slot:description)
              p.live-chat-text {{header.phone.info}}
          .mobile-popup-close(@click="closeFeedbackPopup(false)") Отменить

      nuxt-link.header-link.header-login(:to="`/${header.auth.alias}`")
        svg.icon.icon-user <use href="#icon-user"/>
        span {{header.auth.name}}

      top-basket(:cart="header.cart")



</template>

<script>
import menuFunc from '~/utils/main-scripts'
import { mapState } from 'vuex'

export default {
  name: 'appHeader',
  data: () => ({
    inputPhone:'',
    pageScrollPosition: 0,
    topInfoPopup: false,
    bottomInfoPopup: false,
    feedbackPopup: false,
  }),
  // head () {
  //   return { bodyAttrs: { class: this.menuOpen ? 'menu-open' : '' } }
  // },
  computed: {
    ...mapState('settings', ['header']),
  },
  methods: {
    menuBottomMobileToggle() {   menuFunc.menuToggle()  },
    showTopInfoPopup() { this.topInfoPopup = !this.topInfoPopup},
    showBottomInfoPopup() { this.bottomInfoPopup = !this.bottomInfoPopup},
    showFeedbackPopup() { this.feedbackPopup = !this.feedbackPopup},
    closeTopInfoPopup(val) { this.topInfoPopup = val },
    closeBottomInfoPopup(val) {this.bottomInfoPopup = val },
    closeFeedbackPopup(val) {this.feedbackPopup = val },
    winScroll () {
      const searchPanelH = document.querySelector('[data-header-search-panel]').offsetHeight
      const hh = document.querySelector('header').offsetHeight + searchPanelH
      if (window.scrollY > this.pageScrollPosition && window.scrollY > hh ) {
        document.body.classList.add('page-scroll-down')
      } else {
        document.body.classList.remove('page-scroll-down')
      }
      this.pageScrollPosition = window.scrollY
    },
    // showModal() { this.$modal.show('tab-size') }
    //
  },
  beforeMount () {
    if (process.browser) window.addEventListener('scroll', this.winScroll, {passive: true})
  },
  beforeDestroy() {
    if (process.browser) window.removeEventListener('scroll', this.winScroll)
  }
}

</script>

<style lang="scss" >
@import "header";
/*.header-feedback-popup .popup-body {*/
/*  max-width: 245px;*/
/*  min-width: 245px;*/
/*}*/
</style>
