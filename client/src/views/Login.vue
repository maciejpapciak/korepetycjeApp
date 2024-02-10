<template>
  <div class="form-panel login wrapper">
    <div class="bg-overlay"></div>
    <div class="wrapper">
      <h2 class="section-name">{{ $t('loginPage.sectionName') }}</h2>
      <h3 class="form-heading">{{ $t('loginPage.Title') }}</h3>
      <p class="form-cta">{{ $t('loginPage.description') }} <router-link class="link" to="/register">{{ $t('loginPage.cta') }}</router-link></p>
      <Form class="login-form" @submit="login">
        <div class="form-group">
          <Field class="text-input" placeholder=" " type="email" name="email" rules="required|email" />
          <i class="far fa-envelope"></i>
          <label class="floating-label" for="email">{{ $t('global.formEmail') }}</label>
          <ErrorMessage name="email" />
        </div>
        <div class="form-group">
          <Field class="text-input" placeholder=" " type="password" name="password" rules="required" />
          <i class="fas fa-key"></i>
          <label class="floating-label" for="password">{{ $t('global.formPassword') }}</label>
          <ErrorMessage name="password" />
        </div>
        <button class="btn btn-primary" type="submit">{{ $t('loginPage.button') }}</button>
      </Form>
    </div>
  </div>
  <Modal @closeModal="closeModal" v-if="this.message.content != ''" :type="this.message.type" :content="this.message.content"/>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate';
import { mapActions, mapState } from 'vuex';
import Modal from '@/components/Modal.vue';

export default {
  name: 'Login',
  components: {
    Form,
    Field,
    ErrorMessage,
    Modal
  },
  methods: {
    ...mapActions({
      login: 'auth/login'
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
  },
  computed: {
    ...mapState('auth',[
      'message',
      'loading'
    ])
  }
}
</script>
