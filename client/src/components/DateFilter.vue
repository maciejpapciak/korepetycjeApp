<template>
    <div class="sortbydate">
    <h3 class="date-heading">{{ $t('dateFilter.addedOn') }}</h3>
    <div class="date-filter">
        <select v-model="allDates">
            <option value="Kiedykolwiek">{{ $t('dateFilter.anytime') }}</option>
            <option value="Dzisiaj">{{ $t('dateFilter.today') }}</option>
            <option value="W tym tygodniu">{{ $t('dateFilter.thisWeek') }}</option>
            <option value="W tym miesiącu">{{ $t('dateFilter.thisMonth') }}</option>
        </select>
        <div class="date-filter__arrow"></div>
    </div>
    </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex';
import moment from 'moment';

export default {
    name: 'DateFilter',
    computed: {
        ...mapState('browse', [
            'afterFilter',
            'after',
            'filter',
            'showType'
        ]),
        ...mapGetters('browse', [
            'getDateFilter'
        ]),
        allDates: {
            set(opt) {
                let val;
                switch (opt) {
                    case 'Kiedykolwiek':
                        val = '2000-01-01T10:00:00';
                        this.$store.commit('browse/setAfterFilter', 'Kiedykolwiek');
                        break;
                    case 'Dzisiaj':
                        val = moment().subtract(1, 'days').format("YYYY-MM-DDTHH:mm:ss");
                        this.$store.commit('browse/setAfterFilter', 'Dzisiaj');
                        break;
                    case 'W tym tygodniu':
                        val = moment().subtract(7, 'days').format("YYYY-MM-DDTHH:mm:ss");
                        this.$store.commit('browse/setAfterFilter', 'W tym tygodniu');
                        break;
                    case 'W tym miesiącu':
                        val = moment().subtract(31, 'days').format("YYYY-MM-DDTHH:mm:ss");
                        this.$store.commit('browse/setAfterFilter', 'W tym miesiącu');
                        break;
                }
                this.$store.commit('browse/setAfter', val);
                if (this.showType == 1)
                    this.$store.dispatch('browse/fetchAds', {page: 0, type: 1, after: this.after, filter: this.filter});
                else
                    this.$store.dispatch('browse/fetchAds', {page: 0, type: 2, after: this.after, filter: this.filter});
            },
            get() {
                return this.getDateFilter;
            }
        }
    }
}
</script>