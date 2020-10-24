<template>
  <header>
    <div v-if="photoURL" class="pos-right">
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn light icon v-bind="attrs" v-on="on">
            <img v-if="photoURL" :src="photoURL">
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-btn @click="logout">
              <v-list-item-title>ログアウト</v-list-item-title>
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div v-else-if="loadingFlg" align="right" >
      <v-btn color="#191970" class="white--text" @click="login">ログイン</v-btn>
    </div>
    <div v-else class="pos-right">
      <Loading/>
    </div>
  </header>
</template>

<script>
import firebase from 'firebase'
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
import Loading from '@/components/Loading'
export default {
  created () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setLoginUser(user)
        this.setloadingFlg(false)
      } else {
        this.deleteLoginUser()
        this.setloadingFlg(true)
      }
    })
  },
  components: {
    Loading
  },
  methods: {
    ...mapActions(['login','setLoginUser', 'logout', 'deleteLoginUser','setloadingFlg'])
  },
  computed: {
    ...mapGetters(['photoURL','loadingFlg'])
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
.pos-right{
    position:absolute;
    right:10px;
    top:10px;
    height: 32px;
    width: 32px;
}
</style>