<template>
  <div class="rating" v-if="size != null">
    <div class="rating-star" :style=style(size) v-for="item in stars" :key="item" v-bind:class="{ 'rating-star-full': ratingStars(item,rating) == 1, 'rating-star-half': ratingStars(item,rating) == 0 }"></div>
  </div>
</template>

<script>
export default {
  name: "Rating",
  props: {
    size: Number,
    rating: Number,
  },
  data() {
    return {
      stars: [0,1,2,3,4],
    };
  },
  methods: {
    // /img/star-solid 1.83ea5d5e.svg
    // /img/star 1.18c10200.svg
    // /img/star-half-alt-solid 1.deb4bd8e.svg
    // background-image: url('${(rating-item) >= 1 ? "/img/star-solid 1.83ea5d5e.svg" : (rating-item) >= 0.5 ? "/img/star-half-alt-solid 1.deb4bd8e.svg" : "/img/star 1.18c10200.svg"}');
    style(size) {
      return `width: ${size}rem; height: ${size}rem;`;
    },
    ratingStars(item,rating) {
      return (rating-item) >= 1 ? 1 : (rating-item) >= 0.5 ? 0 : -1;
    }
  },
};
</script>