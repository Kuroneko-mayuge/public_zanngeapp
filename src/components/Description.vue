<template>
  <div>
    <a @click="viewDescription" class="des_title">ZangeAppとは</a>

    <div class="des_container" v-if="des_view">
      <h3>ZangeAppとは</h3>
      <h4>
        <p>このアプリは、</p>
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
  width: 10%;
  height: 10%;
}

.des_container{
  background-color: gray;
  color:aliceblue;
  width: 80%;
  margin-left: 18%;
  margin-right: auto;
  height: 98%;
  text-align: center;
}

</style>