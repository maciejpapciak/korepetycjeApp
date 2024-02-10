<template>
  <div class="calendar-item">
      <p><strong>{{ title }}</strong> w dniu <strong>{{ getWeekday }}</strong> o godzinie <strong>12:00</strong></p>
      <button @click="$emit('handleDelete', id)"><i class="fas fa-trash-alt"></i></button>
  </div>
</template>

<script>
export default {
    name: 'CalendarListItem',
    props: {
        id: Number,
        title: String,
        weekday: Number,
        time: String
    },
    computed: {
        getWeekday() {
            switch (this.weekday) {
                case 1:
                    return 'poniedziałek';
                case 2:
                    return 'wtorek';
                case 3:
                    return 'środa';
                case 4:
                    return 'czwartek';
                case 5:
                    return 'piątek';
            }
        }
    }
}
</script>