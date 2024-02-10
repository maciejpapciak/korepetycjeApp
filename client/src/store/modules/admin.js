const admin = {
    namespaced: true,
    state: {
        advertisements: [],
        currentPage: 1,
        totalPages: 1
    },
    getters: {
        
    },
    actions: {
        fetchUnacceptedAds: async (context, page=0) => {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/api/v1/adminpanel?status=false&page=${page}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('JWTtoken')}`,
                        'Access-Control-Allow-Origin': '*'
                    }
                });
                if (response.status == 200){
                    const resData = await response.json();
                    context.commit('setAdvertisements',resData.data.advertisement);
                    context.commit('setCurrentPage', resData.currentPage);
                    context.commit('setTotalPages', resData.totalPages);
                }
            } catch (error) {
                console.log(error);
            }
        },
        acceptAd: async (context, event) => {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/api/v1/adminpanel/accept/${event}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('JWTtoken')}`,
                        'Access-Control-Allow-Origin': '*'
                    }
                });
                const resData = await response.json();
                context.commit('updateAdvertisements', resData.data.updatedAd.ad_id);
            } catch (error) {
                console.log(error);
            }
        },
        rejectAd: async (context, event) => {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/api/v1/deletead/${event}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('JWTtoken')}`,
                        'Access-Control-Allow-Origin': '*'
                    }
                });
                const resData = await response.json();
                context.commit('updateAdvertisements', resData.data.deletedAd.ad_id);
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
        switchDisplay: (state) => {
            state.displayKorepetycje = !state.displayKorepetycje;
        },
        updateAdvertisements: (state, payload) => {
            state.advertisements = state.advertisements.filter(ad => ad.ad_id != payload);
        }
    }
};

export default admin;