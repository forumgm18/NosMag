<template lang="pug">
  client-only
    ul.breadcrumbs
      li.breadcrumbs-item(v-for="(it, i) in items" itemprop="itemListElement" itemscope  itemtype="https://schema.org/ListItem")
        nuxt-link(v-if="(it.alias!='') || i===0" :to="`/${it.alias}`" itemprop="item" )
          span(itemprop="name") {{it.name}}
          meta(itemprop="position" :content="i+1")
        span(v-else itemprop="item")
          span(itemprop="name") {{it.name}}
          meta(itemprop="position" :content="i+1")

</template>

<script>
export default {
  name: 'v-breadcrumbs',
  props:['items']
}
</script>

<style lang="scss">
@import 'breadcrumbs';

</style>
