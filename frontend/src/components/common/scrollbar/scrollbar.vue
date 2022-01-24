<template lang="pug">
  client-only
    perfect-scrollbar(
      v-once :options="scrollbarOptions" 
      ref="perfectScrollbar"
      )
      //- template(v-bind="$attrs")
      slot
      
  //- div
    slot


</template>

<script>
  export default {
    // inheritAttrs: false,
    props: {
      scrollbarOptions: {
        
      },
      // pfVal: {
      //   default: ()=>[]
      // }
    },
    data() {
      return{}
    },
    methods: {
      // scrollBarInput(e) {
      //   console.log('scrollBarInput e', e)
      //   console.log('scrollBarInput e.target.value', e.target.value)
      //   console.log('scrollBarInput e.target._value', e.target._value)
      //   // this.$emit('input', e.target.value)
      // }
    }
    
  }
</script>

<style lang="scss" scoped>

</style>