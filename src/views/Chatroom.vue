<template>
  <div>
    <div class="header">
      <a href="/">HOME</a>
    </div>

    <!-- チャット部分 -->
    <div class="chat">
      <div v-for="comment in comments" :key="comment.id">
        <v-card color="#E3F2FD" v-if="comment.name === getMyName" id="mine">{{ comment.text }}</v-card>
        <v-card v-else id="him">{{ comment.name }}</v-card>
      </div>
    </div>

    <Review v-if="diffTime < 0"></Review>

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
import Review from '@/components/Review'
export default {
  name: 'Chatroom',
  data: () => ({
    comments: [],
    input: "",
    reviewTime: "",
    diffTime: "",
  }),
  computed: {
    //storeのMynameから名前をString型で抽出
    getMyName: function(){
      return this.$store.state.myName[0];
    }
  },
  components: {
    Review
  },
  methods: {
    //チャット送信処理
    doSend(){
      if (this.input !== ""){
        const roomid = this.$route.params.roomID;
        const messageRef = this.$db.doc(roomid).collection('messages');
        const keyid = Math.floor( Math.random() * (999999 + 1 - 1) ) + 1; //forループのための便宜的なkeyid
        const createdTime = new Date();
        const newItem = { id:keyid, name:this.getMyName, text:this.input, createdAt:createdTime };
        messageRef.add(newItem);
        this.input = "";
      }
    },
    checkTime(){
      const nowTime = new Date().getTime();
      this.diffTime = this.reviewTime - nowTime;
    }
  },
  created: function() {
    const _this = this;
    const roomid = this.$route.params.roomID;
    //終了時刻を取得
    this.$db.doc(roomid).get()
    .then((doc) => {
      _this.reviewTime = Date.parse(doc.data().finishTime);
    });
    //終了時刻から現在時刻を１秒毎に引く
    if (_this.diffTime >= 0){
      const countDown = setInterval(() => {
        _this.checkTime();
        if(_this.diffTime < 0){
          clearInterval(countDown);
        }}, 1000);
      }
    //チャット更新処理
    const messageRef = this.$db.doc(roomid).collection('messages');
    messageRef.orderBy('createdAt')
    .onSnapshot(function (querySnapshot){
      _this.comments = []
      querySnapshot.forEach(function(doc) {
        const catchdata = doc.data()
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