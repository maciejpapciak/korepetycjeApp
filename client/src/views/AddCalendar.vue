<template>
    <div class="wrapper flex-column">
        <div>
            <h1 class="create-header">
                Dodaj pozycję do kalendarza
            </h1>
            <form class="login-form" @submit.prevent="addToCalendar">
                <div class="form-group">
                    <input
                    class="text-input create-font"
                    placeholder=""
                    type="text"
                    name="title"
                    required
                    v-model="title"
                    />
                    <label class="floating-label" for="tytul">{{ $t('createOffer.formTitle') }}</label>
                    <ErrorMessage name="title" />
                </div>
                <div class="form-group">
                    <select
                    class="text-input create-font create-category"
                    name="weekday"
                    placeholder=""
                    type="text"
                    required
                    v-model="weekday"
                    >
                        <option class="text-input create-category-option" value="1">poniedziałek</option>   
                        <option class="text-input create-category-option" value="2">wtorek</option>   
                        <option class="text-input create-category-option" value="3">środa</option>   
                        <option class="text-input create-category-option" value="4">czwartek</option>   
                        <option class="text-input create-category-option" value="5">piątek</option>   
                    </select>
                    <label class="floating-label" for="weekday">Wybierz dzień tygodnia</label>
                </div>
                <div class="flex-row">
                    <div class="form-group">
                        <label>Godzina rozpoczęcia</label>
                        <vue-timepicker :hour-range="[[8,19]]" hide-disabled-hours format="HH:mm" v-model="startTimeData"></vue-timepicker>
                    </div>
                    <div class="form-group">
                        <label>Godzina zakończenia</label>
                        <vue-timepicker :hour-range="[[8,19]]" hide-disabled-hours format="HH:mm" v-model="endTimeData"></vue-timepicker>                    
                    </div>
                </div>
                <button class="btn btn-primary user-data-change" type="submit">
                    Zapisz
                </button>
            </form>
        </div>

        <div v-if="this.getEvents.length != 0">
            <h1 class="create-header">
                Zarzadzaj kalendarzem
            </h1>
            <ul class="calendar-list">
                <CalendarListItem @handleDelete="handleDelete($event)" v-for="item in getEvents" :key="item.id" :title="item.title" :id="item.id" :weekday="item.daysOfWeek[0]" :time="item.startTime" />
            </ul>
        </div>
    </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import VueTimepicker from 'vue3-timepicker/src/VueTimepicker.vue'
import 'vue3-timepicker/dist/VueTimepicker.css';
import CalendarListItem from '@/components/CalendarListItem.vue';
import {mapGetters} from 'vuex';

export default {
    name: 'AddCalendar',
    components: {
        Form,
        Field,
        ErrorMessage,
        VueTimepicker,
        CalendarListItem
    },
    data() {
        return {
            title: '',
            startTimeData: '08:30',
            endTimeData: '10:30',
            weekday: '1'
        }
    },
    computed: {
        ...mapGetters('callendar', [
            'getEvents'
        ])
    },
    methods: {
        addToCalendar() {
            console.log(JSON.stringify(
                {
                    title: this.title,
                    timeStart: this.startTimeData,
                    timeEnd: this.endTimeData,
                    weekday: this.weekday
                }
            ));
            this.$store.dispatch('callendar/addToCallendar', 
                {
                    title: this.title,
                    timeStart: this.startTimeData,
                    timeEnd: this.endTimeData,
                    weekday: this.weekday
                }
            );
            this.$router.go(-1);
        },
        handleDelete($event) {
            this.$store.dispatch('callendar/deleteFromCalendar', $event);
        }
    },
    async created() {
        this.$store.dispatch('callendar/fetchCallendar', localStorage.getItem('user_id'));
    }
}
</script>