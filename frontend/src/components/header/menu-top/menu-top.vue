<template lang="pug">
  .menu-container
    //.menu-close.bgr-close( @click="menuClose"  @mouseenter="itemMouseLeave" )
    burger
    .menu-close.bgr-close( @click="menuClose"  @mouseenter="itemMouseLeave" )
    .menu-block


      scroll-bar.menu-scroll.lv-1
        .menu-scroll-body
          ul#menu.menu(@mouseenter="itemMouseLeave")
            li.menu-item(
              v-for="(itm, i ) in  menuItems"
              :key="i"
              :data-menu-id="`lv2-${i}`"
              :class="{open: lv2Open === `lv2-${i}`}"
              @mouseover="itemMouseEnter"
              @click.prevent="itemClick"

            )
              div.menu-link
                span {{itm.name}}
                .menu-arrow-next
                  svg.icon.icon-arrow-default <use href="#icon-arrow-default"/>
          ul.menu.menu-info(@mouseenter="itemMouseLeave")
            li.menu-item(v-for="(lnk, j ) in  header.info.links")
              //nuxt-link.menu-link(:to="`${translit(itm.name)}${lnk.alias}`" @click.native="menuClose")
              nuxt-link.menu-link(:to="`!${lnk.alias}`" @click.native="menuClose")
                span {{lnk.name}}
            li.menu-item.menu-phone
              a.menu-link(:href="header.phone.link" @click="menuClose") {{header.phone.name}}

      .submenu-block
        scroll-bar.menu-scroll
          .menu-scroll-body
            ul.submenu.lv-2(
              v-for="(item, ind) in menuItems"
              :data-menu-id="`lv2-${ind}`"
              :class="{open: lv2Open === `lv2-${ind}`}"
              @mouseover="itemMouseEnter"
            )
              li.submenu-item.title.go-back(@click.prevent="goBack(2)")
                span {{item.name}}
                .menu-arrow-next.go-back
                  svg.icon.icon-arrow-default <use href="#icon-arrow-default"/>

              li.submenu-item(
                v-for="(subitem, j) in item.items"
                :data-menu-id="`lv2-${ind}-lv3-${j}`"
                :class="{open: lv3Open === `lv2-${ind}-lv3-${j}`}"
              )
                nuxt-link.submenu-link.title(
                  v-if="subitem.items === undefined"
                  :to="`${translit(item.name)}${subitem.link}`"
                  @click.native="menuClose"
                  ) {{subitem.name}}
                .submenu-link.title(v-else @click.prevent="subitemClick")
                  span {{subitem.name}}
                  .menu-arrow-next
                    svg.icon.icon-arrow-default <use href="#icon-arrow-default"/>
                ul.submenu.lv-3(
                  v-if="subitem.items != undefined"
                  :class="{open: lv3Open === `lv3-${j}`}"
                  )
                  li.submenu-item.title.go-back(@click.prevent="goBack(3)")
                    span {{subitem.name}}
                    .menu-arrow-next.go-back
                      svg.icon.icon-arrow-default <use href="#icon-arrow-default"/>

                  li.submenu-item(v-for="(l, k) in subitem.items")
                    nuxt-link.submenu-link(:to="`${translit(item.name)}${l.link}`" @click.native="menuClose") {{l.name}}

</template>

<script>
import menuFunc from '~/utils/main-scripts'
import burger from '~/components/header/burger/burger'
// import customSelect from '~/components/custom-select'
import ScrollBar from 'vue2-scrollbar'
import { mapState } from 'vuex'

export default {
  name: 'MenuTop',
  components: { burger, ScrollBar },
  // props: ['menuItems'],
  data: () => ({
    // arrItems: [],
    // arrSubItems: {}
    lv2Open:'',
    lv3Open:'',
  }),
  computed: {
    ...mapState('menu', ['menuItems']),
    ...mapState('settings', ['header']),
    // header: s => s.$store.getters['header'],
  },
  methods: {
    translit(v){
      // const catalog = '/catalog/'
      // if (v.toUpperCase().includes('НАБОР')) return catalog + 'sets/'
      // if (v.toUpperCase().includes('МУЖЧ')) return catalog + 'mens/'
      // if (v.toUpperCase().includes('ЖЕН')) return catalog + 'womans/'
      // if (v.toUpperCase().includes('ДЕТ')) return catalog + 'childrens/'
      // return ''
      return '/'
    },
    menuClose() {
      menuFunc.menuState(false)
      document.body.classList.remove('submenu-open')
      this.lv2Open = ''
      this.lv3Open = ''
    },
    itemMouseEnter(e) {
      if (window.innerWidth < 769) return
      this.goNext(e.currentTarget)
    },
    itemClick(e) {
      if (window.innerWidth > 768) return
      this.goNext(e.currentTarget)
    },
    subitemClick(e){
      const menuItem = e.currentTarget.parentNode
      this.lv3Open = menuItem.dataset.menuId
    },
    goNext(menuItem) {
      document.body.classList.add('submenu-open')
      this.lv2Open = menuItem.dataset.menuId
    },
    goBack(lv) {
      if (lv === 2) {
        this.lv2Open = ''
        this.lv3Open = ''
        document.body.classList.remove('submenu-open')
      }
      if (lv === 3) this.lv3Open = ''

    },

    itemMouseLeave(e) {
      // // console.log('itemMouseLeave')
      // console.log('itemMouseLeave e:', e)
      if (window.innerWidth < 769) return
      // e.currentTarget.classList.remove('open')
      document.body.classList.remove('submenu-open')
      this.lv2Open = ''
    },
  }

}
</script>

<style lang="scss">
@import "menu";
</style>
