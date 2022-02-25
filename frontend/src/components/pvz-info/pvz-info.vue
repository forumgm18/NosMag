<template lang="pug">
  .pvz-info(v-if="pvzInfo && serviceName.length")
    .pvz-info-menu 
      v-dropdown(placement="top")
        svg.icon.icon-vertical-dots-menu <use href="#icon-vertical-dots-menu"/>  
        template(#popper)
          .tooltip-content
            .pvz-info-details(
              v-close-popper
              @click="emitShowDetails"
              ) О пункте выдачи
    .pvz-info-icon(v-if="icon.length") 
      svg.icon(:class="[icon, iconClass]") 
        use(:href="`#${icon}`")
        
    .pvz-info-item(v-if="pvzName") {{pvzName}}
    .pvz-info-item(v-if="pvzAddr") {{pvzAddr}}
    .pvz-info-item(v-if="pvzWorkTime") {{pvzWorkTime}}
    template(v-if="officeImages")
      .pvz-info-item.link(@click="index=0") Посмотреть фотографии
      cool-light-box( 
        :items="officeImages" 
        :index="index"
        :effect="'fade'"
        @close="index = null"
        )  
    .btn(
      v-if="serviceName != 'samovyvoz'"
      @click="changePvz"
      ) Изменить адрес

</template>

<script>
  export default {
    props: {
      pvzInfo: {
        type: Object,
        default() {return undefined}
      },
      serviceName: {
        type: String,
        default: ''
      },
      icon: {
        type: String,
        default: ''
      },
      iconClass: {
        type: String,
        default: ''
      }

    },
    data() {
      return {
        index: null
      }
    },
    computed: {
      officeImages() {
        let res
        switch(this.serviceName) {
          case 'cdek':
          case 'cdek_pvz':
            if (this.pvzInfo.office_image_list && this.pvzInfo.office_image_list.length ) {
              res = this.pvzInfo.office_image_list.map(item => item.url)
            }
            break
          // case 'samovyvoz':
          //   break
          default:
            res = false  
        }
        return res
      },
      pvzName() {
        let res
        // debugger
        switch(this.serviceName) {
          case 'cdek':
          case 'cdek_pvz':
          case 'samovyvoz':
              res = this.pvzInfo.name
            break
          default:
            res = false  
        }
        return res        
      },
      pvzAddr() {
        let res
        switch(this.serviceName) {
          case 'cdek':
          case 'cdek_pvz':
              res = this.pvzInfo.location_address
            break
          case 'samovyvoz':
              res =this.pvzInfo.address
            break
          default:
            res = false  
        }
        return res        
      },
      pvzWorkTime() {
        let res
        switch(this.serviceName) {
          case 'cdek':
          case 'cdek_pvz':
              res = this.pvzInfo.work_time
            break
          // case 'samovyvoz':
          //     res = this.pvzInfo.name
          //   break
          default:
            res = false  
        }
        return res        
      },
    },
    methods: {
      changePvz() {
        this.$emit('change-pvz')
      },
      emitShowDetails() {
        const val = {
                      id: this.pvzInfo.id || null,
                      coord: [], 
                      data: {
                        code: this.pvzInfo.code || null,
                        name: this.pvzInfo.name || null
                      }
                    }
        switch(this.pvzInfo.type) {
          case 'samovyvoz':
            val.coord = [this.pvzInfo.lat, this.pvzInfo.lon]
            val.id = 'sklad'
            val.data.code = 'sklad'
            break
          default:
            val.coord = [
              parseFloat(this.pvzInfo.location_latitude), 
              parseFloat(this.pvzInfo.location_longitude)]
        }
        this.$emit('show-details', [val])

      }
    }
  }
</script>

<style lang="scss" scoped>
  .pvz {
    &-info {
      font-size: inherit;
      border: 1px solid var(--text-color-default);
      box-sizing: border-box;
      border-radius: 5px;
      padding: 1.5em;
      min-width: 540px;
      position: relative;
        &-menu {
          // border: 1px solid red;
          position: absolute;
          right: 1em;
          top: 1em;
          z-index: 1;
          cursor: pointer;
          font-size: 30px;
          color: var(--base-color1);

        }
        &-icon{
          font-size: 2.6em;
          margin-bottom: .3461em;  
        }
        &-item {
          font-size: inherit;
          margin-bottom: 1em;
        }
        &-details {
          padding: 1em;
          cursor: pointer;
          color: var(--base-color1);
        }
        .link { color: var(--base-color2);}
        .btn {max-width: var(--order-form-btn-maw);}
    }
    &-img {
      padding-bottom: 69%;
      width: 100%;
      position: relative;
      &-item {
        max-width: 187px;
        width: 100%;
        margin: 10px;
      }
      &-box {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        border-radius: 5px;
        overflow: hidden;
        img {
          object-fit: cover;
          object-position: center;
        }
      }
    }
  }
</style>