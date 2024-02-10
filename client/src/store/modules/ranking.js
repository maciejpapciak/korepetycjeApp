const ranking = {
    namespaced: true,
    state: {
        rankingList: []
    },
    getters: {
        
    },
    actions: {
        fetchRanking: async (context) => {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/api/v1/rankings`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('JWTtoken')}`,
                        'Access-Control-Allow-Origin': '*'
                    }
                });
                const resData = await response.json();
                context.commit('setRankingList', resData.data.rankings);
            } catch (error) {
                console.log(error);
            }
        }
    },
    mutations: {
       setRankingList: (state, payload) => {
           state.rankingList = payload
       }
    }
};

export default ranking;