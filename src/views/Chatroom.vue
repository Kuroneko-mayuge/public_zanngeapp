<template>
  <div>
    <div class="header"><a href="/">HOME</a></div>

    <!-- チャット部分 -->
    <div class="chat">
      <div v-for="comment in comments" :key="comment.id">
        <v-card color="#E3F2FD" v-if="comment.name === getMyName" id="mine">{{ comment.text }}</v-card>
        <v-card v-else id="him">{{ comment.name }}</v-card>
      </div>
    </div>
    <!-- コメント送信部分 -->
    <div class="input_container">
      <form action="" @submit.prevent="doSend">
        <textarea
          v-model="input"
          class="textlines"
          @keydown.enter.exact.prevent="doSend"></textarea>
        <button type="submit">Send</button>
      </form>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Chatroom',
  data: () => ({
    comments: [],
    input: "",
  }),
  computed: {
    //ここではMyname配列から名前だけをString型で抽出することを想定
    getMyName: function(){
      return this.$store.state.myName[0];
    }
  },
  methods: {
    doSend(){
      if (this.input !== ""){
        const id = this.$route.params.roomID;
        const messageRef = this.$db.doc(id).collection('messages');

        const keyid = Math.floor( Math.random() * (999999 + 1 - 1) ) + 1; //forループのための便宜的なkeyid
        const createdTime = new Date();
        const newItem = { id:keyid, name:this.getMyName, text:this.input, createdAt:createdTime };
        messageRef.add(newItem);

        this.input = "";
      }
    }
  },
  created: function() {
    const id = this.$route.params.roomID;
    const messageRef = this.$db.doc(id).collection('messages');
    const _this = this

    //firestoreのデータが更新されたら、チャット表示を更新
    messageRef.orderBy('createdAt')
    .onSnapshot(function (querySnapshot){
      _this.comments = []
      querySnapshot.forEach(function(doc) {
        let catchdata = doc.data()
        _this.comments.push(catchdata)
      })
    })
  }
}
</script>

<style>
.header {
  position: fixed;
  top: 1%;
}

.chat {
  margin: 1% 3%;
  width: 95%;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: auto;
}

#mine {
  width: 40%;
  margin-right: auto;
  padding: 2% 15% 2% 1%;
}
#him {
  width: 40%;
  margin-left: auto;
  padding: 2% 15% 2% 1%;
}

/* チャット入力欄 */
.input_container {
  position: fixed;
  bottom: 5%;
  width: 100%;
  margin: 0;
}

.textlines {
  border: 2px solid #0a0;  /* 枠線 */
  border-radius: 0.67em;   /* 角丸 */
  padding: 0.5em;          /* 内側の余白量 */
  background-color: snow;  /* 背景色 */
  width: 70%;             /* 横幅 */
  height: 80%;           /* 高さ */
  font-size: 1em;          /* 文字サイズ */
  line-height: 1.2;        /* 行の高さ */
}

/* チャットコメント部分 */

</style>