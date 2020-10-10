<template>
  <div>
    <star-rating v-bind:increment="0.5"
    v-bind:max-rating="3"
    inactive-color="#000"
    active-color="#f00"
    v-bind:star-size="90">
    </star-rating>
  </div>
</template>

<script>
import StarRating from 'vue-star-rating'
export default {
  name: 'Rating',
  data: () => ({
    rating: 0
  }),
  components: {
    StarRating,
  },

}
</script>