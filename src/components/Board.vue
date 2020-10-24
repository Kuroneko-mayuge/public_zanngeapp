<template>
  <div>
    掲示板
    {{ boardTexts.text }}
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'Board',
  data: () => ({
    boardTexts: []
  }),
  created: function(){
    const boarddb = firebase.firestore().collection('board');
    const _this = this;
    boarddb.get()
    .then((querySnapshot) => {
     querySnapshot.forEach(function(doc){
        const catchdata = doc.data();
        _this.boardTexts.push(catchdata);
    })})
  }
}
</script>