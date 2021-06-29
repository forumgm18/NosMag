<template lang="pug">
  footer
    .container
      .footer-row
        .footer-logo-block
          a.logo-link(href="/")
            svg.icon.icon-logo <use href="#icon-logo"/>
      .footer-row.footer-menu-block
        .footer-menu-col
          .footer-collapse(:class="{show: fColShow1}")
            .footer-title(@click="fColToggle1")
              span {{footer.contacts.header}}
              .menu-arrow-next.down
            .footer-collapse-body
              .footer-address
                p(v-for="(cts, i) in footer.contacts.lines")
                  span.footer-address-label(v-if="cts.header") {{cts.header}}
                  a(v-if="cts.link" :href="cts.link") {{cts.name}}
                  span.footer-address-text(v-else) {{cts.name}}
        .footer-menu-col
          .footer-collapse(:class="{show: fColShow2}")
            .footer-title(@click="fColToggle2")
              span {{fmCol1.header}}
              .menu-arrow-next.down
            .footer-collapse-body
              nuxt-link.footer-menu-link(v-for="(lnk, k) in fmCol1.links" :to="`/${lnk.alias}`") {{lnk.name}}

        .footer-menu-col
          .footer-collapse(:class="{show: fColShow3}")
            .footer-title(@click="fColToggle3")
              span {{fmCol2.header}}
              .menu-arrow-next.down
            .footer-collapse-body
              nuxt-link.footer-menu-link(v-for="(lnk, k) in fmCol2.links" :to="`/${lnk.alias}`") {{lnk.name}}

          .footer-mobile-sb
            .footer-social
              a.footer-social-link(v-for="(s, y) in footer.ilinks" :href="s.link")
                svg.icon(:class="s.name")
                  use(:href="`#${s.name}`")
            a.footer-yamarket-link(:href="footer.yamarket.link")
              svg.icon(:class="[`${footer.yamarket.name}`, 'stars' ,`stars-${footer.yamarket.rating}`]" )
                use(:href="`#${footer.yamarket.name}`")

        .footer-menu-col
          .footer-title.hide-mobile {{footer.oplata.header}}
          .footer-oplata
            .footer-oplata-item(v-for="(opl, l) in footer.oplata.items")
              a.footer-oplata-link(v-if="opl.link")
                svg.icon(:class="opl.icon")
                  use(:href="`#${opl.icon}`")
              .footer-oplata-link(v-else)
                svg.icon(:class="opl.icon")
                  use(:href="`#${opl.icon}`")



      .footer-policy-block
        nuxt-link.footer-policy-link(v-for="(t, ti) in footer.tinks" :to="t.alias") {{t.name}}
      .footer-copyright-block {{footer.copyright}}

</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'app-footer',
  data: () => ({
    fColShow1: false,
    fColShow2: false,
    fColShow3: false,
  }),
  computed: {
    ...mapState('settings', ['footer']),
    fmCol1() { return this.footer.columns[0] },
    fmCol2() { return this.footer.columns[1] },
  },
  methods: {
    fColToggle1() {
      if (window.innerWidth > 576) return
      this.fColShow1 = !this.fColShow1
    },
    fColToggle2() {
      if (window.innerWidth > 576) return
      this.fColShow2 = !this.fColShow2
    },
    fColToggle3() {
      if (window.innerWidth > 576) return
      this.fColShow3 = !this.fColShow3
    },
  }

}
</script>

<style lang="scss" scoped>
@import "footer";
</style>
