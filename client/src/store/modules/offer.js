const offer = {
    namespaced: true,
    state: {
        offer: {}
    },
    getters: {
        
    },
    actions: {
        fetchOffer: async (context, id) => {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/api/v1/ads/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('JWTtoken')}`,
                        'Access-Control-Allow-Origin': '*'
                    }
                });
                const resData = await response.json();
                context.commit('setOffer', resData.data.advertisement[0]);
            } catch (error) {
                console.log(error);
            }
        }
    },
    mutations: {
       setOffer: (state, payload) => {
           state.offer = payload;
       }
    }
};

export default offer;