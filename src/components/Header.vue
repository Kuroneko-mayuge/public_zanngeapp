<template>
  <header>
    <div v-if="!$store.state.login_user">
        <v-btn color='info' @click="login">ログイン</v-btn>
    </div>
    <div v-if="$store.state.login_user">
        <img v-if="photoURL" :src="photoURL" @click="logout">
    </div>
  </header>
</template>

<script>
import firebase from 'firebase'
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
export default {
  created () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setLoginUser(user)
      } else {
        this.deleteLoginUser()
      }
    })
  },
  methods: {
    ...mapActions(['login','setLoginUser', 'logout', 'deleteLoginUser',])
  },
  computed: {
    ...mapGetters(['userName', 'photoURL'])
  }
}
</script>

<style>
img {
    -webkit-background-size: 32px 32px;
    background-size: 32px 32px;
    border: 0;
    -webkit-border-radius: 50%;
    border-radius: 50%;
    display: block;
    margin: 0;
    position: relative;
    height: 32px;
    width: 32px;
    z-index: 0;
}
</style>