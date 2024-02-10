const browse = {
    namespaced: true,
    state: {
        advertisements: [],
        classes: [],
        showType: 1,
        after: '2010-05-05T10:00:00',
        currentPage: 1,
        totalPages: 1,
        filter: null,
        classes: [],
        search: '',
        afterFilter: 'Kiedykolwiek'
    },
    getters: {
        korepetycje(state) {
            return state.advertisements.filter(ad => ad.type_id == 1);
        },
        korepetycjeCount(state, getters) {
            return getters.korepetycje.length;
        },
        materialy(state) {
            return state.advertisements.filter(ad => ad.type_id == 2);
        },
        materialyCount(state, getters) {
            return getters.materialy.length;
        },
        classFilter(state) {
            if (state.search != ''){
                return state.classes.filter(clas => clas.name.toLowerCase().includes(state.search.toLowerCase()));
            }
            else {
                return state.classes;
            }
        },
        getDateFilter(state) {
            return state.afterFilter;
        }
    },
    actions: {
        fetchAds: async (context, { page, type, after, filter}) => {
            try {
                if (!filter)
                {
                    const response = await fetch(`${process.env.VUE_APP_API_URL}/api/v1/adsfiltered?page=${page}&type=${type}&after=${after}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('JWTtoken')}`,
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                    const resData = await response.json();
                    context.commit('setAdvertisements',resData.data.advertisement);
                    context.commit('setCurrentPage', resData.currentPage);
                    context.commit('setTotalPages', resData.totalPages);
                    context.commit('setShowType', type);
                    context.commit('setAfter', after);
                    context.commit('setFilter', null);
                }
                else {
                    const response = await fetch(`${process.env.VUE_APP_API_URL}/api/v1/adsfilter?page=${page}&type=${type}&after=${after}&classId=${filter}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('JWTtoken')}`,
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                    const resData = await response.json();
                    context.commit('setAdvertisements',resData.data.advertisement);
                    context.commit('setCurrentPage', resData.currentPage);
                    context.commit('setTotalPages', resData.totalPages);
                    context.commit('setShowType', type);
                    context.commit('setAfter', after);
                    context.commit('setFilter', filter);
                }
            } catch (error) {
                console.log(error);
            }
        },
        fetchClasses: async (context) => {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/api/v1/class`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('JWTtoken')}`,
                        'Access-Control-Allow-Origin': '*'
                    }
                });
                const resData = await response.json();
                context.commit('setClasses', resData.data.classes);
            } catch (error) {
                console.log(error);
            }
        }
        
    },
    mutations: {
        setAdvertisements: (state, payload) => {
            state.advertisements = payload;
        },
        setCurrentPage: (state, payload) => {
            state.currentPage = ++payload
        },
        setTotalPages: (state, payload) => {
            state.totalPages = ++payload
        },
        setShowType: (state, payload) => {
            state.showType = payload
        },
        setAfter: (state, payload) => {
            state.after = payload
        },
        setFilter: (state, payload) => {
            state.filter = payload
        },
        setClasses: (state, payload) => {
            state.classes = payload
        },
        setSearch: (state, payload) => {
            state.search = payload
        },
        setAfterFilter: (state, payload) => {
            state.afterFilter = payload;
        }
    }
};

export default browse;