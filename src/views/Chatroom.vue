<template>
  <div>
    <!-- チャット部分 -->
    <div class="my-parts" v-for="comment in comments" :key="comment.id">
      <div class="my-parts-content">
        <p>{{ comment.text }}</p>
      </div>
    </div>
    
    <!-- コメント送信部分 -->
    <form action="" @submit.prevent="doSend">
      <textarea 
        v-model="input"
        class="textlines"
        @keydown.enter.exact.prevent="doSend"></textarea>
      <button type="submit">Send</button>
    </form>

  <a href="/">HOME</a>
  </div>
</template>

<script>
export default {
  name: 'Chatroom',
  data: () => ({
    comments: [],
    input: "",
  }),
  methods: {
    doSend(){
      const id = this.$route.params.roomID;
      const messageRef = this.$db.doc(id).collection('messages');

      const keyid = Math.floor( Math.random() * (999999 + 1 - 1) ) + 1; //forループのためのkeyid
      const createdTime = new Date();
      const newItem = { id:keyid, text:this.input, createdAt:createdTime };
      messageRef.add(newItem);

      this.input = "";
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
/* チャット入力欄 */
.textlines {
  border: 2px solid #0a0;  /* 枠線 */
  border-radius: 0.67em;   /* 角丸 */
  padding: 0.5em;          /* 内側の余白量 */
  background-color: snow;  /* 背景色 */
  width: 20em;             /* 横幅 */
  height: 120px;           /* 高さ */
  font-size: 1em;          /* 文字サイズ */
  line-height: 1.2;        /* 行の高さ */
}

/* チャットコメント部分 */
.my-parts .my-parts-content {
	float: left;
	width: 60%;
	width: calc(100% - (80px + 20px));
	box-sizing: border-box;
	background: #FFCC80;
	color: #333;
	padding: .8em;
	margin-left: 20px;
  margin-bottom: 10px;
	position: relative;
	border-radius: 8px;
	text-align: left;
}
.my-parts .my-parts-content::after {
	content: "";
	position: absolute;
	top: 50%;
	right: 100%;
	margin-top: -10px;
	border: 10px solid transparent;
	border-right: 10px solid #FFCC80;
	z-index: 2;
}
.my-parts .my-parts-content > :last-child {
	margin-bottom: 0;
}
</style>