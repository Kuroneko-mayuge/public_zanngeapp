<template class="backgroud">
  <v-app>
  <img src="@/assets/demo1.png">
    <HomePage/>
  </v-app>
</template>

<script>
import HomePage from './components/HomePage'
export default {
  name: 'App',
  components: {
    HomePage,
  },
}
</script>

<style>

.backgroud{
  background-color: yellow;
}

</style>