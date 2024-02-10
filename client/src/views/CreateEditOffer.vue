<template>
  <div class="wrapper flex-column">
    <div class="create">
      <div class="create-image-left"></div>
      <div class="create-container">
        <h1 class="create-header">
          {{ edycja ? "Edytuj ofertę" : "Utwórz nową ofertę" }}
        </h1>
        <Form class="login-form" @submit="save">
          <div class="form-group">
            <Field
              class="text-input create-font"
              placeholder=""
              type="text"
              name="tytul"
              rules="required"
              :value="tytul"
            />
            <label class="floating-label" for="tytul">{{ $t('createOffer.formTitle') }}</label>
            <ErrorMessage name="tytul" />
          </div>

          <div class="form-group">
            <Field
              class="text-input create-font"
              placeholder=""
              type="text"
              name="opis"
              rules="required"
              minlength="5"
              :value="opis"
            />
            <label class="floating-label" for="opis">{{ $t('createOffer.formDesc') }}</label>
            <ErrorMessage name="opis" />
          </div>

          <div class="form-group">
            <select
              class="text-input create-font create-category"
              id="kategoria"
              name="kategoria"
              placeholder=""
              type="text"
              rules="required"
              :value="kategoria"
              @change="zmienKategorie($event)"
            >
            <option
                class="text-input create-category-option"
                :value="0"
                :key="0"
              >-- {{ $t('createOffer.formCategory') }} --</option>
              <option
                class="text-input create-category-option"
                v-for="category in kategorie"
                :value="category.class_id"
                :key="category.class_id"
              >
                {{ category.name }}
              </option>
            </select>
            <label class="floating-label" for="tytul">{{ $t('createOffer.formCategory') }}</label>
          </div>

          <div class="create-container-price">
            <div class="form-group">
              <Field
                class="text-input create-font"
                placeholder=""
                type="number"
                name="cena"
                rules="required"
                min="0"
                :value="cena"
              />
              <label class="floating-label" for="cena">{{ $t('createOffer.formPrice') }}</label>
              <ErrorMessage name="cena" />
            </div>
            <label class="offer-price create-container-price-label">
              ZŁ<mark class="slash"> / </mark
              ><mark class="hour">{{
                isKorepetycje ? "Godzina" : "Pakiet"
              }}</mark>
            </label>
          </div>

          <TypeSwitcher @switched="onTypeChange" :startValue="isKorepetycje" />

          <button class="btn btn-primary user-data-change" type="submit">
            {{ edycja ? $t('createOffer.formSave') : `+ ${$t('createOffer.formAdd')}` }}
          </button>
        </Form>
      </div>
      <div class="create-image-right"></div>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import { mapActions, mapState } from "vuex";
import TypeSwitcher from "@/components/TypeSwitcher.vue";

export default {
  name: "CreateEditOffer",
  components: {
    Form,
    Field,
    ErrorMessage,
    TypeSwitcher,
  },
  data() {
    return {
      tytul: "",
      opis: "",
      cena: 0,
      kategoria: 0,
      isKorepetycje: true,
      edycja: false,
      kategorie: [],
    };
  },
  props: {
    przekazanyTytul: null,
    przekazanyOpis: null,
    przekazanaCena: null,
    przekazaneId: null,
    przekazanyTyp: null,
    przekazanaKategoria: null,
  },
  methods: {
    ...mapActions(["createeditoffer"]),
    async save(context, values) {
      if (this.kategoria == 0) return;
      if (this.edycja) {
        const requestOptions = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("JWTtoken")}`,
          },
          body: JSON.stringify({
            title: context.tytul,
            content: context.opis,
            price: Number(context.cena).toString(),
            classId: Number(this.kategoria).toString(),
            typeId: Number(this.isKorepetycje ? 1 : 2).toString(),
          }),
        };
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/api/v1/ads/${this.przekazaneId}`,
          requestOptions
        );
        const data = await response.json();
      } else {
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("JWTtoken")}`,
          },
          body: JSON.stringify({
            title: context.tytul,
            content: context.opis,
            price: Number(context.cena).toString(),
            classId: Number(this.kategoria).toString(),
            typeId: Number(this.isKorepetycje ? 1 : 2).toString(),
          }),
        };
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/api/v1/ads`,
          requestOptions
        );
        const data = await response.json();
      }
      this.$router.go(-1);
    },
    onTypeChange(value) {
      this.isKorepetycje = value;
    },
    zmienKategorie(value) {
      this.kategoria = event.target.value;
    },
    async pobierzKategorie() {
      const response = await fetch(
        `${process.env.VUE_APP_API_URL}/api/v1/class`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("JWTtoken")}`,
          },
        }
      );
      const resData = await response.json();
      var tempKategorie = resData.data.classes;
      if (tempKategorie.length > 0) {
        this.kategorie = tempKategorie;
      }
    },
  },
  async created() {
    this.isKorepetycje = this.przekazanyTyp === "true";
    if (
      this.przekazaneId != "null" &&
      this.przekazanyOpis != "null" &&
      this.przekazanaCena != "null" &&
      this.przekazanyTytul != "null" &&
      this.przekazanaKategoria != "null"
    ) {
      this.edycja = true;
      this.tytul = this.przekazanyTytul;
      this.opis = this.przekazanyOpis;
      this.cena = this.przekazanaCena;
      this.kategoria = Number(this.przekazanaKategoria);
    }
    await this.pobierzKategorie();
  },
};
</script>
