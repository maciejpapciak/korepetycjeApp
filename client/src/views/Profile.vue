<template>
  <div class="wrapper flex-column">
    <div class="header">
      <div class="header-left-image"></div>
      <div class="header-user-data-container user" v-if="!isEditing">
        <div class="flex-column">
          <Avatar :size="10" :avatarUrl="this.avatar"/>
          <button
            class="btn btn-primary user-data-change user-data-change-edit-2"
            v-on:click="editData()"
            v-if="this.isSelf"
          >
            {{ $t('user.editData') }}
          </button>
        </div>
        <UserData
          :userName="userName + ' ' + userSurname"
          :phoneNumber="phoneNumber"
          :email="email"
          :rating="isFullProfile() ? rating : 0"
        />
        <div class="user-contacts">
          <button
            v-if="this.facebookLink != null" v-on:click="redirectToFacebook()"
            class="btn user-contacts-facebook"
          ></button>
          <!-- <button class="btn user-contacts-whatsapp"></button>
          <button class="btn user-contacts-telegram"></button> -->
        </div>
      </div>
      <div class="header-user-data-container user flex-column" v-if="isEditing">
        <Form class="login-form" @submit="saveData">
          <div class="form-group-parent">
            <div class="form-group">
              <Field
                class="text-input"
                placeholder=" "
                type="name"
                name="name"
                rules="required"
                :value="userName"
              />
              <!-- <i class="far fa-user"></i> -->
              <label class="floating-label" for="name">Wpisz imię</label>
              <ErrorMessage name="name" />
            </div>
            <div class="form-group">
              <Field
                class="text-input"
                placeholder=" "
                type="lastname"
                name="surname"
                rules="required"
                :value="userSurname"
              />
              <!-- <i class="far fa-user"></i> -->
              <label class="floating-label" for="lastname"
                >{{ $t('profilePage.inputLastname') }}</label
              >
              <ErrorMessage name="username" />
            </div>
          </div>
          <div class="form-group">
            <Field
              class="text-input"
              placeholder=" "
              type="phone"
              name="phone_number"
              rules="required"
              :value="phoneNumber"
            />
            <i class="fas fa-phone"></i>
            <label class="floating-label" for="phone"
              >{{ $t('profilePage.inputPhone') }}</label
            >
            <ErrorMessage name="phone" />
          </div>

          <div class="form-group">
            <Field
              class="text-input"
              placeholder=" "
              type="link"
              name="facebook_url"
              :value="facebookLink"
            />
            <i class="fab fa-facebook-f"></i>
            <label class="floating-label" for="fb"
              >{{ $t('profilePage.inputFb') }}</label
            >
          </div>

          <div class="form-group">
            <Field
              class="text-input"
              placeholder=" "
              type="link"
              name="avatar"
              :value="avatar"
            />
            <i class="fas fa-user"></i>
            <label class="floating-label" for="avatar"
              >{{ $t('profilePage.inputAvatar') }}</label
            >
          </div>

          <!-- <div class="form-group">
            <Field
              class="text-input"
              placeholder=" "
              type="password"
              name="password"
              rules="required|min:6"
            />
            <i class="fas fa-key"></i>
            <label class="floating-label" for="password">Wpisz hasło</label>
            <ErrorMessage name="password" />
          </div>
          <div class="form-group">
            <Field
              class="text-input"
              placeholder=" "
              type="password"
              name="password-repeat"
              rules="required|min:6|confirmed:@password"
            />
            <i class="fas fa-key"></i>
            <label class="floating-label" for="password">Powtórz hasło</label>
            <ErrorMessage name="password-repeat" />
          </div> -->
          <button class="btn btn-primary user-data-change" type="submit">
            {{ $t('profilePage.saveData') }}
          </button>
        </Form>
        <!-- <button class="btn btn-primary user-data-change" v-on:click="saveData()">Zapisz</button> -->
      </div>
      <div class="header-right-image"></div>
    </div>
    <div class="section-flex-column" v-if="isFullProfile()">     
      <TypeSwitcher @switched="onTypeChange" :startValue="true" />
      <div class="section" v-if="this.isKorepetycje">
        <div class="section-add">
          <h2 class="section-name">{{ $t('profilePage.lessons') }}</h2>
          <button
            class="btn btn-primary user-data-change"
            v-on:click="createOffer()"
            v-if="this.isSelf"
          >
            + {{ $t('createOffer.formAdd') }}
          </button>
        </div>
        <Offer
          v-for="item in filterOffers(true)"
          :key="item.ad_id"
          :id="item.ad_id"
          :price="Number(item.price)"
          :title="item.title"
          :description="item.content"
          :isLesson="true"
          :categoryId="item.class_id"
          :isSelf="this.isSelf"
          :categories="this.allCategories"
          @delete="deleteOffer"
        />
      </div>
      <div class="section" v-if="!this.isKorepetycje">
        <div class="section-add">
          <h2 class="section-name">Materiały</h2>
          <button
            class="btn btn-primary user-data-change"
            v-on:click="createOffer()"
            v-if="this.isSelf"
          >
            + {{ $t('createOffer.formAdd') }}
          </button>
        </div>
        <Offer
          v-for="item in filterOffers(false)"
          :key="item.ad_id"
          :id="item.ad_id"
          :price="Number(item.price)"
          :title="item.title"
          :description="item.content"
          :isLesson="false"
          :categoryId="item.class_id"
          :isSelf="this.isSelf"
          :categories="this.allCategories"
          @delete="deleteOffer"
        />
      </div>
      <div class="section calendar-main">
        <h2 class="section-name" @click="ontest">Kalendarz</h2>
        <button v-if="this.isSelf" class="btn btn-primary" @click="addToCallendar">Zarządzaj kalendarzem</button>
        <FullCalendar v-if="this.callendarOptions.events.length != 0" :options="this.callendarOptions" />
        <p v-else>Brak pozycji w kalendarzu.</p>

      </div>
      <div class="section">
        <div class="section-flex">
          <h2 class="section-name">{{ $t('profilePage.comments') }}</h2>
          <button
            class="btn btn-primary user-data-change"
            v-on:click="switchCommentWritting()"
            v-if="!this.isSelf"
          >
            {{this.isWritingComment ? (canAddComment ? $t('profilePage.add') :$t('profilePage.close')) : $t('profilePage.addComment')}}
          </button>
        </div>
        <div v-if="this.isWritingComment">
          <textarea class="text-input comment" id="comment" v-on:input="commentChanged()"></textarea>
          <div class="comment-rating-container">
            <input class="comment comment-rating" type="number" min="0" max="5" id="rating">
            <p class="offer-price">
                <mark class="hour">{{ $t('profilePage.RATING') }}</mark>
          </p>
          </div>
        </div>
        <Comment
          v-for="item in ratingList"
          :key="item.rating_id"
          :comment="item.content"
          :rating="item.rating_number"
          :userId="item.sender_id"
          :ratingId="item.rating_id"
          @refresh="loadSource"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import { mapActions, mapState, mapGetters } from "vuex";
import Comment from "@/components/Comment.vue";
import Offer from "@/components/Offer.vue";
import TypeSwitcher from "@/components/TypeSwitcher.vue";
import Avatar from "@/components/Avatar.vue";
import UserData from "@/components/UserData.vue";
import '@fullcalendar/core/vdom'
import FullCalendar from '@fullcalendar/vue3';
import timeGridPlugin from '@fullcalendar/timegrid';

export default {
  name: "Profile",
  components: {
    Form,
    Field,
    ErrorMessage,
    Comment,
    Offer,
    TypeSwitcher,
    Avatar,
    UserData,
    FullCalendar
  },
  data() {
    return {
      userName: null,
      userSurname: null,
      phoneNumber: null,
      rating: 0,
      email: null,
      facebookLink: null,
      advertisementList: [],
      ratingList: [],
      isKorepetycje: true,
      isEditing: false,
      avatar: null,
      isSelf: false,
      isWritingComment: false,
      canAddComment: false,
      allCategories: [],
      userType: 2
    };
  },
  computed: {
    ...mapState("auth", ["userData"]),
    ...mapGetters('callendar', ['callendarOptions'])
  },
  methods: {
    ontest() {
      console.log(this.callendarOptions.events[0]);
    },
    addToCallendar() {
      //this.$store.dispatch('callendar/addToCallendar', {timeStart: '14:00', timeEnd: '16:00', weekday: '5', title: 'hehehehe'});
      this.$router.push('/addcalendar');
    },
    ...mapActions(["profile"]),
    onTypeChange(value) {
      this.isKorepetycje = value;
    },
    editData() {
      this.isEditing = true;
    },
    async deleteOffer(id) {
      const requestOptions = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('JWTtoken')}`
            }};
          const response = await fetch(
          `${process.env.VUE_APP_API_URL}/api/v1/deletead/${id}`, requestOptions
          );
      const data = await response.json();
      this.advertisementList.splice(this.advertisementList.indexOf(this.advertisementList.find(element => element.ad_id == id)), 1)
    },
    filterOffers(isLesson) {
      if (this.advertisementList == null || this.advertisementList.length == 0) {
        return []
      }
      else {
        return this.advertisementList.filter(function(ad) {
          return isLesson ? ad.type_id == 1 : ad.type_id != 1;
        });
      }
    },
    async saveData(context, values) {
      try {
        // console.log(JSON.stringify(context, (key, value) => {
        //   if (value !== null) return value
        // }, 2));
      const requestOptions = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('JWTtoken')}`
            },
          body: JSON.stringify(context, (key, value) => {
            if (value !== null) return value
          })
        };
          console.log(requestOptions.body);
          const response = await fetch(
          `${process.env.VUE_APP_API_URL}/api/v1/profile/${this.userData.user_id}`, requestOptions
          );
          const data = await response.json();
          this.loadSource();
          this.isEditing = false;
      } catch (error) {
        console.log(error)
      }
    },
    createOffer() {
      this.$router.push({
        name: "CreateEditOffer",
        params: {
          przekazanyTytul: null,
          przekazanyOpis: null,
          przekazanaCena: null,
          przekazaneId: null,
          przekazanyTyp: this.isKorepetycje,
          przekazanaKategoria: null
        },
      });
    },
    switchCommentWritting() {
      if(this.isWritingComment && this.canAddComment) {
        this.addComment()
        this.canAddComment = false;
      }
      this.isWritingComment = !this.isWritingComment;
    },
    async addComment() {
      if(this.isComment().length == 0) return;
      const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('JWTtoken')}`
            },
          body: JSON.stringify({
            recipentId: this.$route.params.id,
            ratingNumber: this.ratingNormalize(),
            content: this.isComment()
        })
        };
          const response = await fetch(
          `${process.env.VUE_APP_API_URL}/api/v1/comment`, requestOptions
          );
          const data = await response.json();
          this.loadSource();
    },
    commentChanged() {
      this.canAddComment = (this.isComment().length > 0);
    },
    isComment() {
      if (document.getElementById("comment") == null || document.getElementById("comment") == undefined) return '';
      return document.getElementById("comment").value;
    },
    ratingNormalize() {
      if (document.getElementById("rating") == null || document.getElementById("rating") == undefined) return 0;
      var rating = document.getElementById("rating").value;
      return rating < 0 ? 0 : rating > 5 ? 5 : rating;
    },
    async loadSource() {
    const response = await fetch(
          `${process.env.VUE_APP_API_URL}/api/v1/korepetytors/${this.$route.params.id}`
        );
        this.isSelf = (Number(this.$route.params.id) === Number(this.userData.user_id))
        const data = await response.json();
        var korepetytor = data.data.korepetytor;
        this.userType = korepetytor.user_type;
        this.userName = korepetytor.name;
        this.userSurname = korepetytor.surname;
        this.phoneNumber = korepetytor.phone_number;
        this.email = korepetytor.email;
        this.avatar = korepetytor.avatar;
        this.facebookLink = korepetytor.facebook_url;
        this.advertisementList = Array.from(korepetytor.advertisement);
        this.ratingList = Array.from(
          korepetytor.user_rating_userTouser_rating_recipent_id
        );
        if (this.ratingList.length > 0) {
          var sum = 0;
          this.ratingList.forEach((rating) => {
            sum += rating.rating_number;
          })
          this.rating = sum/this.ratingList.length;
        }
    },
    redirectToFacebook() {
      window.open(this.facebookLink, '_blank');
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
    },
    isFullProfile() {
      return this.userType != 2; 
    }
  },
  async created() {
    await this.pobierzKategorie();
    this.loadSource();
    this.$store.dispatch('callendar/fetchCallendar', this.$route.params.id);
  },
};
</script>
