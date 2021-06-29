<template lang="pug">
  client-only
    ul.breadcrumbs
      li.breadcrumbs-item(v-for="(it, i) in items")
        nuxt-link(v-if="(it.alias!='') || i===0" :to="`/${it.alias}`") {{it.name}}
        span(v-else) {{it.name}}


</template>

<script>
export default {
  name: 'breadcrumbs',
  props:['items']
}
</script>

<style scoped>

</style>
