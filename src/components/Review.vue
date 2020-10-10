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
export default {
  name: "Review",
  data:() => ({
    rating: 5
  }),
  components: {
    StarRating
  },
  methods: {
  review: function(){
    console.log(this.rating)
  }
  }
}
</script>