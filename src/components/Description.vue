<template>
  <div>
    <a @click="viewDescription" class="des_title">このアプリは？</a>
    <div class="des_container" v-if="des_view">
      <h3>Zan-ge!とは</h3>
      <h4 class="first-des">
        <p>「誰でもいいから聞いて欲しい」</p>
        <p>「誰の話でもいいから聞いてみたい」</p>
        <p>を繋げます</p>
      </h4>
      <h4 class="first-des">
        <p>神父になる場合、</p>
        <p>どんな話でも、相手をなるべく受け容れてください</p>
        <p>人は誰でも過ちを犯します</p>
      </h4>
      <h4 class="first-des">
        <p>懺悔をする場合、</p>
        <p>どんな事を話しても問題ありません</p>
        <p>「誰かを傷つけた」「仕事でミスをした」「不倫をした」</p>
        <p>ただ誰かと話したいだけでも結構です</p>
      </h4>
      <div>
        <v-btn color="white" @click="viewDescription">閉じる</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Description',
  data: () => ({
  des_view: false,
  }),
  methods: {
    viewDescription: function(){
      this.des_view = !this.des_view;
    }
  }
}
</script>

<style>
a{
  text-decoration: none;
}

a:hover{
  text-decoration: underline;
}

.des_title {
  width: 200%;
  height: 10%;
  font-size: 15px;
}

.des_container{
  background-color: #5b5b6b;
  color:aliceblue;
  width: 380%;
  margin-left: 30%;
  height: 98%;
  text-align: center;
  opacity: 0.92;
  overflow: scroll;
}

h4{
  margin-top: 10%;
}

</style>