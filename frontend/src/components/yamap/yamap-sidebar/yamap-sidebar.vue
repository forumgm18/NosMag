<template lang="pug">
  .map-sidebar
    v-yamap-pvz-list(
      v-if="!isShowDetail && !showDetailOnly"
      :pvz-list="pvzList"
      :title="title"
      
      v-model="pvzPreSelect"
      @input="showDetail"
      @marker-select="markerSelect"
      )
    v-yamap-pvz-info(
      v-else
      :key="pvzPreSelect.code"
      :pvz-code="pvzPreSelect.code"
      :title="pvzPreSelect.name"
      :show-detail-only="showDetailOnly"
      :pvz-info="pvzInfo"
      @go-back="closeDetail"
      @select-pvz="pvzSelect"
      )



</template>

<script>
  export default {
    props: {
      pvzList: {
        type: Array,
        default() {return []}
      },
      title: {
        type: String,
        default: 'Пункт выдачи заказов'
      },
      value: {},
      showDetailOnly: {
        type: Boolean,
        default: false
      },
      pvzInfo: {
        type: Object,
        default: undefined
      },
      marker: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        isShowDetail: false,
        pvzPreSelect: null,
        addrCommentCollapse: true,
      }
    },
    created() {
      if (this.showDetailOnly && this.pvzList.length) {
        this.pvzPreSelect={ code: this.pvzList[0].data.code, name: this.pvzList[0].data.name}
      }
      if (this.marker) {
        this.pvzPreSelect = this.marker
        this.isShowDetail = true
      }
    },
    computed: {
      locModel: {
        get() { return this.value},
        set(val) { this.$emit('input', val)}
      }
    },
    watch: {
      locModel(v) {
        this.pvzPreSelect = v
        this.showDetail()
      },
      marker(val) {
      if (val) {
        this.pvzPreSelect = val
        this.isShowDetail = true
      }

      }
    },
    methods: {
      showDetail() {
        // debugger
        this.isShowDetail = true
        },
      closeDetail() {this.isShowDetail = false},
      pvzSelect(val) {
        this.locModel = val
        this.$emit('modal-close')
        this.$emit('select-pvz', val)

      },
      markerSelect() {
        this.$emit('marker-select', this.pvzPreSelect)
      }
    }
  }
</script>

<style lang="scss" >
.map-sidebar {
  // width: 430px;
  flex-shrink: 0;
  // flex-basis: 25.44%;
  flex-basis: 21rem;
  min-width: 260px;
      @include media-max-width2($md - 1){
        flex-grow: 1;
        flex-basis: auto;
        width: 100%;
        height: 50%;
      }

  &-panel {
    background-color: #fff;
    font-size: 1rem;
    padding: 0 0 0 .5em;
    height: 100%;
    flex-shrink: 0;
    &.detail {
      .map-sidebar-item {
        // padding-bottom: 0;
        padding-top: 0;
        &:after {content: none;}
        &.btn-inside {padding-top: 1.5em;}
      }
    }
  }
  &-title {
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 5;
    line-height: 1.1;
    padding: 1em .6666em;
    margin-right: .3333em;
    // margin: 0 .6666em;
    border-bottom: 1px solid var(--base-color4);

      .icon {
        margin-right: .5em;
        cursor: pointer;
        }

  }
  &-scroll {
    // height: 100%;
    height: calc(100% - 4.74em);
  }
  &-list {
    padding-right: .5em;
  }
  &-item {
    font-size: inherit;
    font-weight: normal;
    padding: 1.5em 1em;
    border-radius: 5px;
    transition: .3s;
    cursor: pointer;
    position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        // left: 5px;
        left: 0;
        height: 1px;   
        // width: calc(100% - 10px);
        width: 100%;
        background: var(--base-color4);
        

      }
      // &.btn-inside {
      //   padding-bottom: 0;
      // }


    &.pre-select {
      background: var(--base-color1);
      color: #fff;
      &::after {content: none;}
    }
    .btn {
      width: 100%;
      font-size: .8em;
      margin-top: 1.875em;      
    }  
    &_title {
      font-size: .8em;
      opacity: .4;
      margin-bottom: .3125em;
    }
    &_text {
      font-size: inherit;
      line-height: 1.4;
      font-weight: normal;

      &.bold { font-weight: 500;}
      span {
        display: inline-block;
        margin-right: .5em;
        }
      .phone-link {
        color: inherit;
        display: inline-block;
        margin-right: .5em;

      }  
      &-collapse {
        transition: .3s;
        max-height: 100vh;
        overflow: hidden;
        &.collapse {
          transition: .3s;
          max-height: 2.8em;
        }
      }
    }
  }
  &-show-more {
    font-size: .8em;
    font-weight: 500;
    color: var(--base-color1);
    cursor: pointer;
    width: min-content;
    width: fit-content;
    border-bottom: 1px dashed currentColor;
  }  
}  
</style>