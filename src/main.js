import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router/router'
import { rtdbPlugin } from 'vuefire'
import firebase from "firebase/app";
import "firebase/auth";

Vue.use(rtdbPlugin)
Vue.config.productionTip = false

let app
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      vuetify,
      router,
      render: h => h(App)
    }).$mount('#app')
  }
})