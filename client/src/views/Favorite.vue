<template>
  <div class="wrapper flex-column favorite">
    <div class="section">
      <h2 class="section-name">{{ $t('favorite.followedOffers') }}</h2>
        <div v-if="!followed[0]"><h2>{{ $t('favorite.noFavorite') }}</h2></div>
        <Offer v-else :key="offer.advertisement_ad_id" v-for="offer in followed"
          :id="offer.advertisement_ad_id"
          :price="offer.price"
          :title="offer.title"
          :description="offer.content"
          :rating="offer.Rating"
          :userName="offer.nickname"
          :isFollowed="this.followedArray.includes(offer.advertisement_ad_id) ? true : false"
          @follow="handleFollow($event)"
          @unfollow="handleUnfollow($event)"
        />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Offer from "@/components/Offer.vue";

export default {
  name: "Profile",
  components: {
    Offer
  },
  computed: {
      ...mapState('follow',[
        'followed'
      ]),
      ...mapGetters('follow', [
        'followedArray'
      ])
  },
  async created() {
    this.$store.dispatch('follow/fetchFollowed');
  },
  methods: {
    handleFollow($event) {
      this.$store.dispatch('follow/handleFollow', $event);
    },
    handleUnfollow($event) {
      this.$store.dispatch('follow/handleUnfollow', $event);
    },
    async pobierzKategorie() {
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/api/v1/class`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("JWTtoken")}`,
            },
          }
      );
      const resData = await response.json();
      var tempKategorie = resData.data.classes;
      if (tempKategorie.length > 0) {
        this.allCategories = tempKategorie;
      }
    }
  },
  data() {
      return {
        allCategories: []
      }
    },
};
</script>
