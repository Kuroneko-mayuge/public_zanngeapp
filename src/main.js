import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import firebase from 'firebase'

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyD44rELz_sVOeNr_9pkacchYwD5eUjmxPA",
  authDomain: "vue-zangeapp.firebaseapp.com",
  databaseURL: "https://vue-zangeapp.firebaseio.com",
  projectId: "vue-zangeapp",
  storageBucket: "vue-zangeapp.appspot.com",
  messagingSenderId: "34323535128",
  appId: "1:34323535128:web:0974a92496f73b14c2ba6d",
  measurementId: "G-P5S1ET9NQY"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
