<template>
  <v-container>
    <star-rating
    v-model="rating"
    :increment="0.5"
    :max-rating="5"
    inactive-color="#000"
    active-color="yellow"
    :star-size="40">
    </star-rating>
  
    <v-btn @click="review">評価して終了</v-btn>
  </v-container>
</template>

<script>
import StarRating from 'vue-star-rating'
import { mapGetters } from 'vuex'
import firebase from 'firebase'
export default {
  name: "Review",
  data:() => ({
    rating: 3
  }),
  components: {
    StarRating
  },
  computed: {
    ...mapGetters(['hostFlg'])
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
            if(doc.exists){
              const nowStatus = doc.data().reviewVal;
              const newStatus = nowStatus + this.rating;
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
            if(doc.exists){
              const nowStatus = doc.data().reviewVal;
              const newStatus = nowStatus + this.rating;
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