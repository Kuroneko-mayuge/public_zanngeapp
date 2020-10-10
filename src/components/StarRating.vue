<template>
  <div>
    <star-rating
    v-model="rating"
    :increment="0.5"
    :max-rating="5"
    inactive-color="#000"
    active-color="yellow"
    :star-size="40">
    </star-rating>
  </div>
</template>

<script>
import StarRating from 'vue-star-rating'
export default {
  name: 'Rating',
  data: () => ({
    rating: 3
  }),
  components: {
    StarRating,
  },

}
</script>