<template>
  <div>
    <p id="message">Are You Satisfied?</p>
    <star-rate
    v-model="value"
    type="heart"
    active-color="#d4237a"
    :hover-change="true">
    </star-rate>
    <br>
    <v-btn @click="review"
    color="#191970" class="white--text">相手を評価して終了</v-btn>
    <div class="heart"></div>
  </div>
</template>

<script>
import StarRate from 'vue-cute-rate'
import { mapGetters } from 'vuex'
import firebase from 'firebase'
export default {
  name: "Review",
  data:() => ({
    value: 3
  }),
  components: {
    StarRate
  },
  computed: {
    ...mapGetters(['uid','hostFlg'])
  },
  methods: {
  review: function(){
    if(this.hostFlg){
      const roomid = this.$route.params.roomID;
      this.$db.doc(roomid).get()
        .then((doc) => {
          const target_uid = doc.data().member.visitor;
          const targetUserRef = firebase.firestore().collection('users').doc(target_uid);
          targetUserRef.get()
          .then((doc) => {
            if(doc.exists && this.uid != target_uid){
              const nowStatus = doc.data().reviewVal;
              const newStatus = nowStatus + this.value;
              targetUserRef.update({
                reviewVal: newStatus
              }).then(()=>{
                location.href="/";
              })
            }else{
              location.href="/";
            }
          })
          })
      }else{
      const roomid = this.$route.params.roomID;
      this.$db.doc(roomid).get()
        .then((doc) => {
          const target_uid = doc.data().member.host;
          const targetUserRef = firebase.firestore().collection('users').doc(target_uid);
          targetUserRef.get()
          .then((doc) => {
            if(doc.exists && this.uid != target_uid){
              const nowStatus = doc.data().reviewVal;
              const newStatus = nowStatus + this.value;
              targetUserRef.update({
                reviewVal: newStatus
              }).then(()=>{
                location.href="/";
              })
            }else{
              location.href="/";
            }
          })
        })
      }
    }
  }
}
</script>

<style>
#message{
  font-family: cursive;
  color: brown;
  font-size: 21px;
}

</style>