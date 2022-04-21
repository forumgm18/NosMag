<template lang="pug">
  client-only
    ul.breadcrumbs(v-if="!isModile")
      li.breadcrumbs-item(
        v-for="(it, i) in items" 
        v-tooltip="{ content: it.name, theme: 'tooltip_breadcrumbs' }"
        itemprop="itemListElement" 
        itemscope  
        itemtype="https://schema.org/ListItem"
        )
        nuxt-link(v-if="(it.alias!='') || i===0" :to="`/${it.alias}`" itemprop="item" )
          span(itemprop="name") {{it.name}}
          svg.icon.icon-arrow-down <use href="#icon-arrow-down"/>
          meta(itemprop="position" :content="i+1")
        span(v-else itemprop="item")
          span(itemprop="name") {{it.name}}
          meta(itemprop="position" :content="i+1")
    .breadcrumbs-mobile(v-else-if="lastAlias")
      nuxt-link.breadcrumbs-mobile_back(:to="`/${lastAlias.alias}`" :title="lastAlias.name")
        svg.icon.icon-arrow-back <use href="#icon-arrow-back"/>
      .breadcrumbs-mobile_title {{lastAlias.name}}


</template>

<script>
export default {
  name: 'v-breadcrumbs',
  props:{
    items: {
      type: Array,
      default() {return []}
    }
  },
  data() {
    return {
      winWidth: 0
    }
  },
  computed: {
    isModile() { return this.winWidth < 768  },
    lastAlias() { return this.items.length ? this.items.filter(v => v.alias.length).reverse()[0] : false },
  },
  methods: {
    onResize() { this.winWidth = process.browser ? window.innerWidth : 0  }
  },
  beforeMount(){ window.addEventListener('resize', this.onResize) },
  beforeDestroy(){ window.removeEventListener('resize', this.onResize) },
  mounted(){ this.$nextTick( this.onResize ) },

}
</script>

<style lang="scss">
@import 'breadcrumbs';

</style>
