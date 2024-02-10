<template>
  <div class="offer">
    <div class="offer-title-container">
      <h2 class="offer-title">{{title}}</h2>
    </div>
    <label class="offer-description"
      >{{description.substring(0, 90) + '...'}}</label
    >
    <div class="offer-bottom">
      <div class="offer-price-container">
        <p class="offer-price">
          {{price}} ZŁ<mark class="slash"> / </mark><mark class="hour">{{isLesson ? $t ('offer.hour') : $t ('offer.package')}}</mark>
        </p>
        <router-link class="btn offer-link" :to="`/offer/${id}`">{{ $t('offer.readMore') }}</router-link>
      </div>
      <button v-show="this.$route.fullPath != '/admin' && !isFollowed" class="follow-icon" @click="$emit('follow', id)">
          <i class="far fa-heart"></i>
      </button>
      <button v-show="this.$route.fullPath != '/admin' && isFollowed" class="follow-icon" @click="$emit('unfollow', id)">
          <i style="font-weight:700" class="far fa-heart"></i>
      </button>
      <div class="offer-user offer-user-container" v-if="userName != null">
        <label class="offer-user-name">{{userName}}</label>
        <Rating :size=1.3 :rating="rating" />
        <div class="offer-user-avatar">
          <Avatar :size=3 :avatarUrl=avatarUrl />
        </div>
      </div>
      <div v-else>
        <div v-if="this.isSelf">
          <button class="btn btn-primary user-data-change user-data-change-edit" v-on:click="editOffer()">{{ $t('offer.editOffer') }}</button>
          <button class="btn btn-primary user-data-change" v-on:click="deleteOffer()">{{ $t ('offer.deleteOffer')}}</button>
        </div>
      </div>
    </div>
    <div v-if="this.$route.fullPath == '/admin'">
      <button @click="$emit('acceptAd', id)" class="btn btn-primary">
            {{$t('offer.accept')}}
      </button>
      <button @click="$emit('rejectAd', id)" class="btn btn-primary">
            {{$t('offer.reject')}}
      </button>
    </div>
  </div>
</template>

<script>
import Rating from '@/components/Rating.vue';
import Avatar from '@/components/Avatar.vue';

export default {
  name: "Offer",
  components: {
    Rating,
    Avatar
  },
  data() {
    return {
      kategorie: ['-- Kategorie --','Matematyka', 'Fizyka', 'Język polski', 'Język angielski']
    };
  },
  props: {
    id: Number,
    price: Number,
    title: String,
    description: String,
    categoryId: Number,
    rating: Number,
    userName: String,
    avatarUrl: String,
    isLesson: Boolean,
    isSelf: Boolean,
    isFollowed: Boolean
  },
  methods: {
    avatar_url(avatarUrl) {
      if (avatarUrl != null) {
        return "background-image: url('" + avatarUrl + "');";
      } else {
        return null;
      }
    },
    deleteOffer() {
      this.$emit('delete', this.id);
    },
    editOffer() {
     this.$router.push({
        name: "CreateEditOffer",
        params: {
          przekazanyTytul: this.title,
          przekazanyOpis: this.description,
          przekazanaCena: this.price,
          przekazanyTyp: this.isLesson,
          przekazaneId: this.id,
          przekazanaKategoria: this.categoryId
        },
      });
    }
  },
};
</script>