import router from "../../router/index.js"

const auth = {
    namespaced: true,
    state: {
        userData: localStorage.getItem('user') || {
            user_type: localStorage.getItem('user_type') || 0,
            user_id: localStorage.getItem('user_id') || null
        },
        JWTtoken: localStorage.getItem('JWTtoken') || null,
        message: {
            content: '',
            type: ''
        },
        loading: false,
    },
    getters: {
        getState: state => state,
        loggedIn: state => state.JWTtoken,
        isAdmin: state => (state.userData.user_type == 1)
    },
    actions: {
        // Logowanie użytkownika, na razie console log xd
        login: async (context, values) => {
            context.commit('toggleLoading', true);
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/api/v1/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify(values)
                });
                if (response.status == 200)
                {
                    const resData = await response.json();
                    context.commit('setToken', resData.token);
                    context.commit('setUserData', resData.data.user);
                    router.push('/');
                }
                else if (response.status == 401)
                {
                    context.commit('setMessage', {content: 'Błędne hasło lub email.', type: 'error'});
                }
                context.commit('toggleLoading', false);
            } catch (error) {
                context.commit('setMessage', {content: "Błąd serwera. Spróbuj ponownie później.", type: 'error'});
                console.log(error);
                context.commit('toggleLoading', false);
            }
        },

        // Rejestracja użytkownika
        register: async (context, values) => {
            //console.log(JSON.stringify(values));
            context.commit('toggleLoading', true);
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/api/v1/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify(values)
                });
                if (response.status == 201)
                {
                    const resData = await response.json();
                    context.commit('setMessage', {content: 'Rejestracja przebiegła pomyślnie. Sprawdź email, aby aktywować konto.', type: resData.status});
                }
                else if (response.status == 500)
                {
                    context.commit('setMessage', {content: 'Taki użytkownik już istnieje.', type: 'error'});
                }
                context.commit('toggleLoading', false);
            } catch (error) {
                context.commit('setMessage', {content: "Błąd serwera. Spróbuj ponownie później.", type: 'error'});
                console.log(error);
                context.commit('toggleLoading', false);
            }
        },

         // Aktywacja konta przez link w emailu
         verify: async(context, values) => {
            context.commit('toggleLoading', true);
            try{
                const response = await fetch(`${process.env.VUE_APP_API_URL}/api/v1/auth/confirmation/${values.email}/${values.token}`,{
                    method: 'GET',
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    }
                });
                const resData = await response.json();
                if (response.status == 200)
                {
                    context.commit('setMessage', {content: 'Konto zostało aktywowane.', type: resData.status});
                }
                else if (response.status == 500)
                {
                    context.commit('setMessage', {content: 'Konto zostało już aktywowane wcześniej.', type: resData.status});
                }
                else if (response.status == 401)
                {
                    context.commit('setMessage', {content: 'Wystąpił błąd. Nie znaleziono takiego użytkownika', type: resData.status});
                }
                context.commit('toggleLoading', false);
            } catch (error) {
                context.commit('setMessage', {content: "Błąd serwera. Spróbuj ponownie później.", type: 'error'});
                console.log(error);
                context.commit('toggleLoading', false);
            }
        },

        logout: (context) => {
            context.commit('destroyToken');
            router.push('/login');
        }
    },
    mutations: {
        setMessage: (state, payload) => {
            state.message = payload
        },
        toggleLoading: (state, payload) => {
            state.loading = payload || !state.loading;
        },
        setToken: (state, payload) => {
            state.JWTtoken = payload;
            localStorage.setItem('JWTtoken', payload);
        },
        destroyToken: (state) => {
            localStorage.removeItem('JWTtoken');
            localStorage.removeItem('user_id');
            localStorage.removeItem('user_type');
            state.JWTtoken = null;
            state.user = { user_type: 0 };
        },
        setUserData: (state, payload) => {
            state.userData = payload;
            localStorage.setItem('user_id', payload.user_id);
            localStorage.setItem('user_type', payload.user_type);
        }
    }
};

export default auth;