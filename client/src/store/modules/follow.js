const follow = {
    namespaced: true,
    state: {
        followed: []
    },
    getters: {
        followedArray: (state) => {
            return state.followed.map(item => item.advertisement_ad_id);
        }
    },
    actions: {
        handleFollow: async (context, id) => {
            const response = await fetch(`${process.env.VUE_APP_API_URL}/api/v1/follow/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('JWTtoken')}`,
                    'Access-Control-Allow-Origin': '*'
                }
            });
            const resData = await response.json();
            context.commit('updateFollowed', {advertisement_ad_id: resData.data.createdFollow.advertisement_ad_id});
        },
        handleUnfollow: async (context, id) => {
            await fetch(`${process.env.VUE_APP_API_URL}/api/v1/follow/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('JWTtoken')}`,
                    'Access-Control-Allow-Origin': '*'
                }
            });
            context.commit('removeFollowed', id);
        },
        fetchFollowed: async (context) => {
            const response = await fetch(`${process.env.VUE_APP_API_URL}/api/v1/follow`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('JWTtoken')}`,
                    'Access-Control-Allow-Origin': '*'
                }
            });
            const resData = await response.json();
            context.commit('setFollowed', resData.data.followers);
        }
    },
    mutations: {
       updateFollowed: (state, payload) => {
           state.followed.push(payload); 
       },
       removeFollowed: (state, payload) => {
           state.followed = state.followed.filter(follow => follow.advertisement_ad_id != payload);
       },
       setFollowed: (state, payload) => {
           state.followed = payload;
       }
    }
};

export default follow;