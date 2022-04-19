import Vue from 'vue'
import PortalVue from 'portal-vue'
Vue.use(PortalVue, {
  portalName: 'v-teleport', // default: 'portal'
  portalTargetName: 'v-teleport-target', // default:'portal-target'
})