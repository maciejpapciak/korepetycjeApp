import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import plLocale from '@fullcalendar/core/locales/pl';

const callendar = {
    namespaced: true,
    state: {
        events: [],
    },
    getters: {
        getEvents(state) {
            return state.events;
        },
        callendarOptions(state) {
            return {
                locales: [ plLocale ],
                locale: localStorage.getItem('locale') || 'pl',
                plugins: [ timeGridPlugin, interactionPlugin ],
                initialView: 'timeGridWeek',
                allDaySlot: false,
                slotMinTime: "08:00:00",
                slotMaxTime: "20:00:00",
                nowIndicator: true,
                headerToolbar: {
                    start: '',
                    center: '',
                    end: ''
                },
                weekends: false,
                events: state.events,
                dayHeaderFormat: { weekday: 'long' }
                }
        }
    },
    actions: {
        fetchCallendar: async (context, id) => {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/api/v1/calendar/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('JWTtoken')}`,
                        'Access-Control-Allow-Origin': '*'
                    }
                });
                const resData = await response.json();
                console.log(resData);
                context.commit('setEvents', resData.data.callendar);
            } catch (error) {
                console.log(error);
            }
        },
        addToCallendar: async (context, event) => {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/api/v1/calendar`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('JWTtoken')}`,
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            timeStart: '1970-01-01T'+event.timeStart+':00Z',
                            timeEnd: '1970-01-01T'+event.timeEnd+':00Z',
                            weekday: event.weekday,
                            title: event.title
                        }
                    )                    
                });
                const resData = await response.json();
                console.log('tak', resData.data.newCalendar);
                context.commit('addToEvents', resData.data.newCalendar);
            } catch (error) {
                console.log('nie', error);
            }
        },
        deleteFromCalendar: async (context, id) => {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/api/v1/calendar/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('JWTtoken')}`,
                        'Access-Control-Allow-Origin': '*',
                    }                    
                });
                const resData = await response.json();
                context.commit('removeEvent', resData.data.deletedCalendar);
            } catch (error) {
                console.log('nie', error);
            }
        }
    },
    mutations: {
       setEvents(state, payload) {
           state.events = payload.map(event => {
            return {
                id: event.id,
                startTime: event.time_start.substring(11, 19),
                endTime: event.time_end.substring(11, 19),
                title: event.title,
                daysOfWeek: [event.weekday],
                color: 'var(--clr-accent)',
                textColor: 'var(--clr-text)'
            }
        });
       },
       addToEvents(state, payload) {
           state.events.push(
               {
                    id: payload.id,
                    startTime: payload.time_start.substring(11, 19),
                    endTime: payload.time_end.substring(11, 19),
                    title: payload.title,
                    daysOfWeek: [payload.weekday],
                    color: 'var(--clr-accent)',
                    textColor: 'var(--clr-text)'
               }
           );
       },
       removeEvent(state,payload) {
           state.events = state.events.filter(item => {
               return item.id != payload.id
           })
       }
    }
};

export default callendar;