<template>
  <div class="admin-panel">
      <div class="wrapper ad-list">
          <Offer :key="offer.ad_id" v-for="offer in this.advertisements"
            :id="offer.ad_id"
            :price="offer.price"
            :title="offer.title"
            :description="offer.content"
            @acceptAd="this.$store.dispatch('admin/acceptAd', $event)"
            @rejectAd="this.$store.dispatch('admin/rejectAd', $event)"
          />
          <Pagination @setPage="this.$store.dispatch('admin/fetchUnacceptedAds', $event-1)" :currentPage="this.currentPage" :totalPages="this.totalPages" />
      </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';

import Offer from '@/components/Offer';
import Pagination from '@/components/Pagination';

export default {
    name: 'Admin',
    components: {
        Offer,
        Pagination
    },
    async created() {
        this.$store.dispatch('admin/fetchUnacceptedAds', 0);
    },
    computed: {
      ...mapState('admin',[
        'advertisements',
        'currentPage',
        'totalPages'
      ]),
    }
}
</script>