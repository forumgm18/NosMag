<template lang="pug">
  .selcomm(v-if="selcomm && getSelcommText(selcomm.type_active)")
    span(v-html="`${selcomm.header} &ndash; `") 
    v-dropdown()
      span.selcomm-change {{getSelcommText(selcomm.type_active)}}
      template(#popper)
        ul
          li( v-for="(st, index) in selcomm.types" :key="index" ) 
            v-check-box2( v-model="locValue" :value="st" ) {{st.name}}
</template>

<script>
  export default {
    props: {
      selcomm: {
        type: [Array, Object],
        default: null
      },
      value: {}
    },
    computed: {
      locValue: {
        get() {return this.value},
        set(val) { 
          this.$emit('input', val) 
          },
      }
    },
    methods: {
      getSelcommText(t) {
        const res = this.selcomm.types.find(item => item.type === t)
        return res ? res.name : false
      },

    },
    
  }
</script>

<style lang="scss" scoped>
  .selcomm {
    font-size: .8em;
    line-height: 1.4;
    padding: .9em 1.7em;
    margin-bottom: 1.25em;
    border: 1px solid var(--base-color4);
    border-radius: 5px;
    text-align: center;
      &-change {
        // padding-left: .5em;
        color: var(--base-color1);
        cursor: pointer;
      }
  }

</style>