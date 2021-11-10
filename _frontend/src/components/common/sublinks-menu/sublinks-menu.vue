<template lang="pug">
    //client-only
    ul.sublinks-menu
      li.sublinks-menu-item(v-for="(it, i) in items" )
        nuxt-link(:class="{ active: it.active === 1 }" :to="it.link") {{it.name}}
        ul.sublinks-menu.lv-2(v-if="it.sublinks.length" )
          li.sublinks-menu-item.lv-2(v-for="(subit, j) in it.sublinks" )
            nuxt-link(:to="subit.link") {{subit.name}}

</template>

<script>
  export default {
    name: 'sublinks-menu',
    props:['items']
  }
</script>

<style lang="scss">
  @import 'styles';

</style>
