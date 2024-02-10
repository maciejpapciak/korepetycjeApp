import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import { configure, defineRule } from 'vee-validate';
import { localize, setLocale } from '@vee-validate/i18n';

import AllRules from '@vee-validate/rules';

import i18n from './i18n'

Object.keys(AllRules).forEach(rule => {
    defineRule(rule, AllRules[rule]);
});

defineRule("eligible", (value, [other]) => {
    if (other == "3" && !/[a-z0-9\.-_]*@*wsiz.edu.pl$/.test(value))
    {
        return false;
    }

    return true;
});

// Tłumaczenia błędów formularzy
configure({
    generateMessage: localize({
        pl: {
            messages: {
                required: 'To pole jest wymagane',
                email: 'Email niepoprawny',
                eligible: 'Musisz posiadać email w domenie wsiz.edu.pl',
                regex: 'Hasło musi zawierać minimum 8 znaków, dużą literę, cyfrę',
                confirmed: 'Hasła się nie zgadzają'
            }
        },
        en: {
            messages: {
                required: 'This field is required',
                email: 'Email is incorrect',
                eligible: 'Your email must be in domain format of @prz.edu.pl',
                regex: 'Password must consist of min 8 characters, a capital letter, a digit',
                confirmed: 'Passwords don\'t match'
            }
        }
    })
});

setLocale(localStorage.getItem('locale') || 'pl');

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.getters['auth/loggedIn']) {
        next({
            name: 'Login',
        })
        } else {
        next()
        }
    } else if (to.matched.some(record => record.meta.requiresVisitor)) {
        if (store.getters['auth/loggedIn']) {
        next({
            name: 'Browse',
        })
        } else {
        next()
        }
    } else if (to.matched.some(record => record.meta.requiresAdmin)) {
        if (!store.getters['auth/isAdmin']) {
        next({
            name: 'Browse',
        })
        } else {
        next()
        }
    } else {
        next()
    }
})

createApp(App).use(i18n).use(store).use(router).mount('#app')
