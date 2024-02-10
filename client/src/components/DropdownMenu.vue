<template>
    <nav class="header__nav">
      <ul class="header__navbar">
        <li class="header__item">
          <a href="#" class="header__link">
            <transition name="slide-fade">
              <!-- Header Navigation Menu Icons -->
              <button class="header--button" v-if="show" key="on" @click="show = false">
                <svg viewBox="0 0 24 24" class="header--icon">
                  <title>Close</title>
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path fill="currentColor" d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
                </svg>
              </button>
              <button class="header--button" v-else key="off" @click="show = true">
                <svg viewBox="0 0 24 24" class="header--icon">
                  <title>Navigation Menu</title>
                  <path fill="currentColor" d="M6,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM16,6c0,1.1 0.9,2 2,2s2,-0.9 2,-2 -0.9,-2 -2,-2 -2,0.9 -2,2zM12,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2z" />
                </svg>
              </button>
            </transition>
          </a>
          <!-- Dropdown Menu -->
          <transition name="dropdown">
            <div class="dropdown__menu" v-bind:class="{ active: show }" v-if="show">
              <ul class="dropdown__menu-nav">
                <DropdownMenuItem v-if="this.loggedIn" :name="$t('dropdownMenu.account')" :linkTo="navigateToProfile()" icon="fas fa-user" />
                <DropdownMenuItem v-if="this.loggedIn" :name="$t('dropdownMenu.browse')" linkTo="/" icon="fas fa-search" />
                <DropdownMenuItem v-if="this.loggedIn" :name="$t('dropdownMenu.followed')" linkTo="/favorite" icon="fas fa-heart" />
                <DropdownMenuItem v-if="this.loggedIn" :name="$t('dropdownMenu.ranking')" linkTo="/ranking" icon="fas fa-trophy" />
                <DropdownMenuItem v-if="this.loggedIn" :name="$t('dropdownMenu.logOut')" linkTo="/logout" icon="fas fa-sign-out-alt" />
                <DropdownMenuItem v-if="!this.loggedIn" :name="$t('dropdownMenu.logIn')" linkTo="/login" icon="fas fa-sign-in-alt" />
                <DropdownMenuItem v-if="!this.loggedIn" :name="$t('dropdownMenu.signUp')" linkTo="/register" icon="fas fa-user-plus" />
                <hr />
                <DropdownMenuItem v-if="this.isAdmin && this.loggedIn" name="Admin panel" linkTo="/admin" icon="fas fa-user-shield" />
                <li class="dropdown__menu-item">
                    <button class="dropdown__menu-link" @click="changeLocale">
                        <div class="dropdown__menu-svg">
                            <img v-if="$i18n.locale == 'pl'" src="../assets/flags/uk.svg" alt="English">
                            <img v-if="$i18n.locale == 'en'" src="../assets/flags/pl.svg" alt="English">
                        </div>
                        <div class="dropdown__menu-text">{{ $t('navMenu.changeLanguage') }}</div>
                    </button>
                </li>
                <li class="dropdown__menu-item">
                    <button class="dropdown__menu-link"  @click="toggleTheme" aria-label="Toggle themes">
                        <div class="dropdown__menu-svg">
                            <i class="fas fa-adjust"></i>
                        </div>
                        <div class="dropdown__menu-text">{{ $t('navMenu.changeTheme') }}</div>
					          </button>
                </li>
              </ul>
            </div>
          </transition>
        </li>
      </ul>
    </nav>
</template>

<script>
import DropdownMenuItem from '@/components/DropdownMenuItem.vue';
import {mapGetters, mapState} from 'vuex';
import { setLocale } from '@vee-validate/i18n';

export default {
    name: 'DropdownMenu',
	data() {
        return {
            theme: '',
			show: false
        };
    },
    components: {
        DropdownMenuItem
    },
    computed: {
      ...mapGetters('auth', [
        'loggedIn',
        'isAdmin'
      ]),
      ...mapState("auth", ["userData"]),
    },
	mounted() {
        let localTheme = localStorage.getItem('theme');
        document.documentElement.setAttribute('data-theme', localTheme);
		this.theme=localTheme;
    },
    
	methods: {
	    toggleTheme() {
            this.theme = this.theme == 'darkMode' ? '' : 'darkMode';
            document.documentElement.setAttribute('data-theme', this.theme);
            localStorage.setItem('theme', this.theme);
        },
        navigateToProfile() {
            var userId = this.userData.user_id
            if (userId === undefined) return '';
            return `/profile/${this.userData.user_id}`;
        },
        changeLocale() {
          if (this.$i18n.locale == 'pl'){
            this.$i18n.locale = 'en';
            setLocale('en');
            localStorage.setItem('locale', 'en');
          }
          else {
            this.$i18n.locale = 'pl';
            setLocale('en');
            localStorage.setItem('locale', 'pl');
          }
      }
	}
}
</script>

<style>

</style>