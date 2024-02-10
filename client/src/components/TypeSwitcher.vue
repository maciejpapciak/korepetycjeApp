<template>
  <div class="materialy-korepetycje">
    <i class="materialy-korepetycje-background" v-bind:class="{ 'materialy-korepetycje-background-rotated': !this.isKorepetycje}"></i>
    <label class="btn materialy-korepetycje-materialy" v-on:click="onSwitchType(false)" v-bind:class="{ 'materialy-korepetycje-active': !this.isKorepetycje}">{{ $t('switchType.MATERIALS')}}</label>
    <label
      class="btn materialy-korepetycje-korepetycje" v-on:click="onSwitchType(true)" v-bind:class="{ 'materialy-korepetycje-active': this.isKorepetycje}"
      >{{ $t ('switchType.LESSONS') }}</label
    >
  </div>
</template>

<script>
export default {
  name: "TypeSwitcher",
  methods: {
    onSwitchType (type) {
      if(type != this.isKorepetycje) {
        this.isKorepetycje = type;
        this.$emit('switched', this.isKorepetycje);
      }
    }
  },
  data() {
    return {
      isKorepetycje: true,
    };
  },
   props: {
    startValue: Boolean,
  },
  created() {
   this.isKorepetycje = this.startValue;
  },
};
</script>