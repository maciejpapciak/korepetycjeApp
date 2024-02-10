<template>
  <div class="form-panel wrapper">
    <div class="bg-overlay"></div>
    <div class="wrapper">
      <h2 class="section-name">{{ $t('registerPage.sectionName') }}</h2>
      <!-- <h3 class="form-heading">Rejestracja</h3> -->
      <!-- <p class="form-cta">Masz już konto? <router-link class="link" to="/login">Zaloguj się!</router-link></p> -->
      <Form class="login-form" @submit="register">
        <div class="form-group-parent">
            <div class="form-group">
                <Field class="text-input" placeholder=" " type="name" name="name" rules="required" />
                <!-- <i class="far fa-user"></i> -->
                <label class="floating-label" for="email">{{ $t('registerPage.formName') }}</label>
                <ErrorMessage name="name" />
            </div>
            <div class="form-group">
                <Field class="text-input" placeholder=" " type="surname" name="surname" rules="required" />
                <!-- <i class="far fa-user"></i> -->
                <label class="floating-label" for="email">{{ $t('registerPage.formSurname') }}</label>
                <ErrorMessage name="lastname" />          
            </div>
        </div>
        <div class="form-group">
          <Field class="text-input" placeholder=" " type="text" name="nickname" rules="required" />
          <i class="far fa-user"></i>
          <label class="floating-label" for="email">{{ $t('registerPage.formNickname') }}</label>
          <ErrorMessage name="username" />
        </div>
        <div class="form-group-radio">
            <p>{{ $t('registerPage.formUserType') }}</p>
            <Field type="radio" name="userType" id="szukający" value="2" rules="required" />
            <label for="szukający">{{ $t('registerPage.formSzukajacy') }}</label>
            <Field type="radio" name="userType" id="wystawiający" value="3" rules="required" />
            <label for="wystawiający">{{ $t('registerPage.formWystawiajacy') }}</label>
            <div>
                <ErrorMessage name="usertype" />
            </div>
        </div>
        <div class="form-group">
          <Field class="text-input" placeholder=" " type="email" name="email" rules="required|email|eligible:@userType" />
          <i class="far fa-envelope"></i>
          <label class="floating-label" for="email">{{ $t('global.formEmail') }}</label>
          <ErrorMessage name="email" />
        </div>
        <div class="form-group">
          <Field class="text-input" placeholder=" " type="password" name="password" :rules="{ regex: /^(?=.*[A-Z])(?=.*\d).{8,}$/ }" />
          <i class="fas fa-key"></i>
          <label class="floating-label" for="password">{{ $t('global.formPassword') }}</label>
          <ErrorMessage name="password" />
        </div>
        <div class="form-group">
          <Field class="text-input" placeholder=" " type="password" name="password-repeat" rules="required|confirmed:@password" />
          <i class="fas fa-key"></i>
          <label class="floating-label" for="password">{{ $t('registerPage.formPasswordRepeat') }}</label>
          <ErrorMessage name="password-repeat" />
        </div>
        <button class="btn btn-primary" type="submit">{{ $t('registerPage.button') }}</button>
      </Form>
    </div>
  </div>
  <Modal @closeModal="closeModal" v-if="this.message.content != ''" :type="this.message.type" :content="this.message.content"/>
</template>

<script>
import { Form, Field, ErrorMessage, defineRule } from 'vee-validate';
import { mapActions, mapState} from 'vuex';
import Modal from '@/components/Modal.vue';

export default {
  name: 'Register',
  components: {
    Form,
    Field,
    ErrorMessage,
    Modal
  },
  computed: {
    ...mapState('auth',[
      'message',
      'loading'
    ])
  },
  methods: {
    ...mapActions({
      register: 'auth/register'
    }),
    closeModal() {
      if (this.message.type == 'error'){
        this.$store.commit('auth/setMessage', {content: '', type: ''})
      }
      else {
        this.$router.push('login');
        this.$store.commit('auth/setMessage', {content: '', type: ''});
      }
    }
  }
}
</script>