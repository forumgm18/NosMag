<template lang="pug">
  .promo(v-if="promo")
    .promo-title
      .promo-label 
        svg.icon.icon-percent <use href="#icon-percent"/>
        span {{promo.header}}
      svg.icon.icon-plus(
        :class="{ close: !promoCollapse, 'base-color-1': !promoCollapse}"
        @click="promoCollapse=!promoCollapse"
        ) <use href="#icon-plus"/>
    .promo-code(:class="{ collapse: promoCollapse }")  
      v-input-field(
        v-model="promoCode"
        :placeholder="promo.placeholder"
        error-text="Нет такого кода"
        )
      .btn.mb-0(@click="setPromo") Применить  

</template>

<script>
  export default {
    props: {
      promo: {
        type: Object,
        default: null
      },
      collapse: {
        type: Boolean,
        default: true
      },
      value: {}
    },
    data(){
      return {
        promoCollapse: true,
      }
    },
    computed: {
      promoCode: {
        get() { return this.value},
        set(val) { this.$emit('input', val)},
      }
    },
    mounted() {
      this.promoCollapse = this.collapse
      this.promoCode = this.value
    },
    methods: {
      async setPromo() {
        if (this.promoCode.trim().length === 0) return
        const res = await this.$axios.$post(`/set_promo`, {
          code: this.promoCode,
          session_id: this.$store.state.token.session_id
        })

        if (res.status === 'ok') {
          this.$emit('set-promo-succsess')
        } else {
          this.$emit('set-promo-fail')
        }
        
        
      },

    }
    
  }
</script>

<style lang="scss" scoped>
  .promo {
    width: 100%;
    font-size: inherit;
    
      // @include media-max-width2($md - 1) { 
      //   margin-right: 16px;
      // }
      // @include media-max-width2($xsm) { 
      //   margin-right: 0;
      //   max-width: unset;
      // }
    
      &-label {
          display: flex;
          align-items: center;
          .icon{
            font-size: 1.5em;
            margin-right: .3333em;
          }
        }

      &-code {
        overflow: hidden;
        transition: .3s;
        max-height: 200px;
        padding-top: 0.5em;
        &.collapse {
          max-height: 0;
          padding-top: 0;
        }
      }
      &-title {
        margin-right: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .icon {
          cursor: pointer;
          font-size: 1.5em;
          transition: .1s;
          &.close {
            transform: rotate(45deg);
          }
        }

      }
      .input-field {
        margin-bottom: 1em;
        font-size: inherit;
      }
  }

</style>