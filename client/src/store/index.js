import { createLogger, createStore} from 'vuex'
import auth from './modules/auth'
import browse from './modules/browse'
import admin from './modules/admin'
import ranking from './modules/ranking'
import offer from './modules/offer'
import follow from './modules/follow'
import callendar from './modules/callendar'


export default createStore({
  plugins: [createLogger()],
  modules: {
    auth,
    browse,
    admin,
    ranking,
    offer,
    follow,
    callendar
  }
})
