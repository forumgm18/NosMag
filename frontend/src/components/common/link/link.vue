<template lang="pug">
  component(
    :is="linkExternal ? 'a' : 'NuxtLink'"
    v-bind="{...compProps}"
    
    )
    slot
  
</template>

<script>
  export default {
    props:{ 
      to: {}
     },
    computed: {
      linkExternal() {
        if (typeof this.to === 'string') return this.$isLinkExternal(this.to)
        if (this.to instanceof Object) return this.$isLinkExternal(this.to.path)
        return false
      },
      compProps() {
        let res = { ...this.$attrs} 
        if (this.linkExternal) {
          res.href = this.to
          res.target = '_blank'
        } else {
          res.to = this.to
        }
        return res
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>