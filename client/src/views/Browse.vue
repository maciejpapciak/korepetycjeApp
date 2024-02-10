<template>
  <div class="browse-catalog">
      <div class="wrapper search-section">
        <h2 class="section-name" @click="ontest">{{ $t('browse.subject') }}</h2>
          <div class="class-form">
            <div class="form-group">
              <input autocomplete="false" :value="this.search" @input="updateSearch" class="text-input" placeholder=" " type="text" name="search" />
              <i class="fas fa-search"></i>
              <label class="floating-label" for="search">{{ $t('browse.searchLabel') }}</label>
            </div>
          </div>
          <ul class="class-list">
            <li @click="filterAds(0)" :class="{ active: this.filter==null }" class="class-list__item">{{ $t('browse.allSubjects') }}</li>
            <li @click="filterAds(clas.class_id)" :key="clas.class_id" :class="{ active: clas.class_id==this.filter }" v-for="clas in classFilter" class="class-list__item">{{ clas.name }}</li>
          </ul>
        
      </div>
      <div class="wrapper ad-list">
          <h2 class="section-name" @click="ontest">{{ $t('browse.offers') }}</h2>
          <div class="filter-container">
            <DateFilter />
            <TypeSwitcher @switched="switchType" :startValue="this.showType == 1 ? true : false"/>
          </div>
          <!-- <div v-if="!advertisemets"><h2>Brak ogłoszeń</h2></div> -->
          <Offer :key="offer.ad_id" v-for="offer in advertisements"
            :id="offer.ad_id"
            :price="offer.price"
            :title="offer.title"
            :description="offer.content"
            :rating="offer.Rating"
            :userName="offer.nickname"
            :isLesson="offer.type_id == 1"
            :isFollowed="this.followedArray.includes(offer.ad_id) ? true : false"
            @follow="handleFollow($event)"
            @unfollow="handleUnfollow($event)"
          />
          <Pagination @setPage="handleSetPage($event)" :currentPage="parseInt(this.currentPage)" :totalPages="parseInt(this.totalPages)" />
      </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate';
import TypeSwitcher from '@/components/TypeSwitcher.vue';
import Offer from '@/components/Offer';
import Pagination from '@/components/Pagination';
import DateFilter from '@/components/DateFilter';
import {mapState, mapGetters} from 'vuex';

export default {
    name: 'Browse',
    components: {
      Form,
      Field,
      ErrorMessage,
      TypeSwitcher,
      Offer,
      Pagination,
      DateFilter
    },
    async created() {
      this.$store.dispatch('browse/fetchAds', {page: 0, type: this.showType, after: this.after});
      this.$store.dispatch('browse/fetchClasses');
      this.$store.dispatch('follow/fetchFollowed');
    },
    methods: {
      switchType() {
        if (this.showType == 1)
          this.$store.dispatch('browse/fetchAds', {page: 0, type: 2, after: this.after, filter: this.filter});
        else
          this.$store.dispatch('browse/fetchAds', {page: 0, type: 1, after: this.after, filter: this.filter});
      },
      filterAds(id) {
        this.$store.commit('browse/setFilter', id);
        if (this.showType == 1)
          this.$store.dispatch('browse/fetchAds', {page: 0, type: 1, after: this.after, filter: id});
        else
          this.$store.dispatch('browse/fetchAds', {page: 0, type: 2, after: this.after, filter: id});
      },
      updateSearch(e) {
        this.$store.commit('browse/setSearch', e.target.value);
      },
      handleFollow($event) {
        this.$store.dispatch('follow/handleFollow', $event);
        this.$forceUpdate();
      },
      handleUnfollow($event) {
        this.$store.dispatch('follow/handleUnfollow', $event);
        this.$forceUpdate();
      },
      handleSetPage($event) {
        this.$store.dispatch('browse/fetchAds', {page: $event-1, type: this.showType, after: this.after, filter: this.filter});
      }
    },
    computed: {
      ...mapState('browse',[
        'advertisements',
        'currentPage',
        'totalPages',
        'showType',
        'after',
        'classes',
        'filter',
        'search',
        'afterFilter'
      ]),
      ...mapState('follow',[
        'followed'
      ]),
      ...mapGetters('browse', [
        'korepetycje',
        'materialy',
        'korepetycjeCount',
        'materialyCount',
        'classFilter'
      ]),
      ...mapGetters('follow', [
        'followedArray'
      ])
    }
}
</script>