<template lang="pug">
  .selcomm(v-if="selcomm && getSelcommText(selcomm.type_active)")
    span(v-html="`${selcomm.header} &ndash; `") 
    v-dropdown(
      placement="left"
      @hide="$emit('hide')"
    )
      span.selcomm-change {{getSelcommText(selcomm.type_active)}}
      template(#popper)
        .selcomm-list(:tabindex="-1")
          v-check-box2.selcomm-item( 
            v-for="(st, index) in selcomm.types" 
            :key="index" 
            :tabindex="index"
            v-model="locValue" 
            :value="st" ) {{st.name}}
          .selcomm-label Дополнительный телефон  
          v-input-field(
            type="tel"
            v-model="otherPhoneValue"
            :placeholder="phonePlaiceholder"
            :error-text="errorPoneText"
            :v-mask="phoneMask"
            
            

          )  
</template>

<script>
  export default {
    props: {
      selcomm: {
        type: [Array, Object],
        default: null
      },
      otherPhone: {
        type: String,
        default: ''
      },
      errorPoneText: {
        type: String,
        default: ''
      },
      phonePlaiceholder: {
        type: String,
        default: '+7(999) 999 99 99'
      },

      value: {}
    },
    computed: {
      phoneMask() { return this.$store.getters['settings/phoneMask'] },
      locValue: {
        get() {return this.value},
        set(val) { this.$emit('input', val) },
      },
      otherPhoneValue: {
        get() {return this.otherPhone},
        set(val) {
          this.$emit('update:other-phone', val) 
          },
      }
    },
    methods: {
      getSelcommText(t) {
        const res = this.selcomm.types.find(item => item.type === t)
        return res ? res.name : false
      },

    },
    watch: {
      selcomm(val) {
        console.log('selcomm:', val)
        this.locValue = val.types.filter(v => v.active)
        if (val.phone) this.otherPhoneValue = val.phone
      }  
    }
    
  }
</script>

<style lang="scss" >
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
      &-list {
        padding: 1rem;
      }
      &-item {
        font-size: 1rem;
        padding: .85em 1.4em;
        border: 1px solid var(--base-color4);
        border-radius: 5px;
        display: flex; 
        align-items: center;
        // cursor: pointer;
        transition: .3s;
          &:not(:last-child) {margin-bottom: 1rem;}
          &:hover {
            border-color: var(--base-color1);
            color: inherit;
          }
          &.checked {
            border-color: var(--base-color1);
          }
          .icon {
            font-size: 1.2em!important;
            margin-right: 1em;
          }
      }
      &-label {
        font-size: .8rem;
        margin-bottom: .5em;
      }
  }

</style>