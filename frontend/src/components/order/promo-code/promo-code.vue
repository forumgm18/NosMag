<template lang="pug">
  .promo(v-if="promo")
    .promo-title(@click="promoCollapse=!promoCollapse")
      .promo-label 
        svg.icon.icon-percent <use href="#icon-percent"/>
        span {{promo.header}}
      svg.icon.icon-plus( :class="{ close: !promoCollapse, 'base-color-1': !promoCollapse}" ) <use href="#icon-plus"/>
    .promo-code(:class="{ collapse: promoCollapse, empty: !isError && !(!!promoSuccsess) }")  
      v-input-field(
        v-model="promoCode"
        :placeholder="promo.placeholder"
        :error-text="errorText"
        :set-error-state-final="isError"
        :show-error="false"
        :has-clear="promo.active"
        @clear-input="clearInput"
        @keyup.enter="setPromo"
        )
        template(#error)
          .promo-error( v-if="isError && errorText.length" )  {{errorText}} 
        template(#success)
          .promo-succsess( v-if="!isError && promoSuccsess" )   
            template(v-if="promoSuccsess != 'info'")
              nuxt-link(
                v-if="!$isLinkExternal(promo.link)"
                :to="promo.link"
                v-html="linkText"
                ) 
              a(
                v-else
                :href="promo.link"
                v-html="linkText"
              )  
            span(
              v-else
              v-html="promo.info"
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
      // value: {}
    },
    data(){
      return {
        promoCode: '',
        promoCollapse: true,
        isError: false,
        errorText: ''
      }
    },
    computed: {
      promoSuccsess() { 
        if (!this.promoCode.length) return false
        let res = false
        if (this.promo && this.promo.info) res = 'info'
        if (res && this.promo && this.promo.link) res = 'link'
        if (this.promo && this.promo.info && this.promo.link) res = 'info_link'
        return res
      },

      linkText(){
        if (this.promoSuccsess === 'info_link') return this.promo.info
        if (this.promoSuccsess === 'link') return this.promo.link
      }
    },
    mounted() {
      this.promoCollapse = this.collapse
      this.promoCode = this.promo.code 
    },
    methods: {
      async setPromo(e) {
        console.log('setPromo', e)
        const res = await this.$axios.$post(`/set_promo`, {
          code: this.promoCode,
          session_id: this.$store.state.token.session_id
        })

        if (res.status === 'ok') {
          this.$emit('set-promo-succsess')
          this.isError = false
          this.errorText = ''
        } else {
          this.isError = true
          if (res.error) this.errorText = res.error
        }
        
        
      },
      clearInput() {
        this.isError = false
        this.errorText = ''
        this.promoCode = ''
        this.setPromo()
      }

    }
    
  }
</script>

<style lang="scss" >
  .promo {
    width: 100%;
    font-size: inherit;
   
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
        max-height: 400px;
        padding-top: 1rem;
        &.collapse {
          max-height: 0;
          padding-top: 0;
        }
        
        &:not(.empty) .input-field-container {padding-bottom: 0;}
        
        // .input-field {
        //   input {
        //     padding: .85em;
        //   }
        // }
      }
      &-title {
        margin-right: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        .icon {
          cursor: pointer;
          font-size: 1.5em;
          transition: .1s;
          &.close {
            transform: rotate(45deg);
          }
        }

      }
      &-succsess {
        font-size: .7rem;
        margin-top: .5rem;
        margin-bottom: .7em;
        line-height: 1.2;
        color: var(--text-color-default);
          a {
            color: var(--base-color1);
          }  
      }
      &-error {
        font-size: .7rem;
        margin-top: .5rem;
        margin-bottom: .7em;
        line-height: 1.2;
        color: var(--input-error);
          a {
            color: inherit;
          }  
      }
  }

</style>