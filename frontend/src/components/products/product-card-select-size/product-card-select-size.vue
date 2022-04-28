<template lang="pug">
  client-only
    vue-final-modal(
      v-slot="{ close }"
      v-bind="$attrs"
      v-on="$listeners"
      :resize="false"
      :classes="['modal-container', 'psz-modal']"
      :content-class="['modal-content', 'psz-modal-content' ]"
      :overlay-class="['modal-overlay']"
      :fit-parent="true"
      :ssr="false"
      
      )
      .psz-modal_title
        span.text Выберите размер 
        span.psz-modal_close(@click="close")
          svg.icon.icon-btn-close <use href="#icon-btn-close"/>
      .psz-modal_table-item.title(v-if="sSize && sSize.table && sSize.table.length")
        .col {{sSize.table[0].name}}
        .col(v-if="sSize.table[1]") {{sSize.table[1].name}}
      .psz-modal_table-content(v-if="sizes" ref="pszTc")
        template(v-for="(item, index) in sizes")
          .psz-modal_table-item(
            :key="index"
            :class="{'in-stock' : item.active && item.ostatok > 0, active: item === sSize }"
            @click="selectItem(item)"
            v-if="item.table && item.table.length"
            ) 
            .col {{item.table[0].value}}
            .col(v-if="item.table[1]") {{item.table[1].value}}
      .btn(@click.stop.prevent="$emit('add2cart', close)") {{btnText}}

</template>
<script>
  export default {
    inheritAttrs: false,
    props: {
      sizes: {},
      selectedSize: {},
      btnText: "",
    },
    data(){
      return {
        sSize: {}
      }
    },
    mounted(){
      this.sSize = this.selectedSize
    },
    methods: {
        selectItem(v){
          this.sSize = v
          this.$emit('selectedSize', v )
        }

    }

  }
</script>

<style lang="scss" scoped>
.psz {
  &-modal {
    // font-size: .7rem;
    border-radius: 5px; 
    padding: 10px 16px; 
    // box-shadow: var(--box-shadow-modal);

    &_title {
      font-size: .8571em;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: .5em;
      .text {
        font-weight: bold;
        text-transform: uppercase;
        margin-right: 0.5em;
      }
    }
    &_close{
      font-size: 1em;
      cursor: pointer;
      .icon {
        color: var(--text-color-dafault);

      }
    }
    &_table {
      &-content {
        margin-bottom: 1rem;
      }
      &-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        pointer-events: none;
        color: var(--text-color-light);
        padding: .25em 0;
        &.title {
          font-weight: 500;
          color: var(--text-color-default);
        }
        &.in-stock{
          pointer-events: all;
          cursor: pointer;
          color: var(--text-color-default);
          }
        &.active{
          pointer-events: all;
          cursor: pointer;
          color: var(--base-color1);
          }
        .col {
          width: 48%;
          text-align: center;
        }
      }      
    }
    .btn {font-size: 1em;}
  }
}

</style>