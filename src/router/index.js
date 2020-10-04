import Vue from 'vue'
import VueRouter from 'vue-router'
import Chatroom from '../views/Chatroom.vue'
import firebase from 'firebase'

Vue.use(VueRouter)

const routes = [
  {
    path: '/chatroom/:roomID',
    name: 'chatroom',
    component: Chatroom,
    beforeEnter: function(to,from,next){
      const nextDoc = firebase.firestore().collection('chatroom').doc(to.params.roomID);
      nextDoc.get()
      .then((doc) => {
        const checkdata = (doc.data().member).length;
        if(checkdata === 2){
          next()
        }else{
          alert("マッチングエラー")
          next('/');
        }
      })
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
