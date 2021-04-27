<template>
  <div class="main__container login__container">
    <div class="login__left" data-aos="fade-right" data-aos-duration="2000">
      <div class="login__left__title">
        <div class="title__icon"><i class="fab fa-vuejs"></i></div>
        <div class="title__text">Dripella</div>
      </div>
      <div class="login__left__info">
        <h1 class="login__welcome">Welcome Back!</h1>
        <p class="login__connect">
          To keep connected with us please login with your personal info
        </p>
        <div class="btn btn__rounded btn__absolute" @click="goToSignIn">
          Sign in
        </div>
      </div>
    </div>
    <div class="login__right" data-aos="fade-left" data-aos-duration="2000">
      <div class="login__right__container">
        <h2 class="login__right__title">Create Account</h2>
        <div class="form__login">
          <div class="avatar__image">
            <img :src="this.photoUrl" alt="image-user" />
          </div>
          <form action="#" class="form__login__container">
            <div class="field__input">
              <i class="icon__input fa fa-user"></i>
              <input
                type="text"
                class="input email__text__field"
                placeholder="UserName"
                v-model="userName"
              />
            </div>
            <div class="field__input">
              <i class="icon__input fa fa-signature"></i>
              <input
                type="text"
                class="input full__text__field"
                placeholder="FullName"
                v-model="fullName"
              />
            </div>
            <div class="field__input">
              <i class="icon__input fa fa-lock"></i>
              <input
                type="password"
                class="input password__text__field"
                placeholder="Password"
                v-model="password"
              />
            </div>
            <div class="field__input">
              <i class="icon__input fa fa-check"></i>
              <input
                type="password"
                class="input email__text__field"
                placeholder="Confirm Password"
                v-model="confirmPassword"
              />
            </div>
            <button
              class="btn btn__rounded btn__signin"
              @click="signUp($event)"
            >
              Sign Up
            </button>
            <button class="button__signup btn btn__rounded" @click="goToSignIn">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapActions } from "vuex";
export default {
  name: "Register",
  data: () => ({
    userName: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    photoUrl:
      "https://gravatar.com/avatar/5adc5ab6ae861c87e576946e9e521675?s=400&d=robohash&r=x",
  }),
  methods: {
    goToSignIn() {
      this.$router.push("/login");
    },
    async signUp(event) {
      event.preventDefault();
      if (
        this.userName &&
        this.fullName &&
        this.password &&
        this.confirmPassword
      ) {
        if (this.password !== this.confirmPassword) {
          Vue.toasted
            .show("Require password and cofirm password must be match!")
            .goAway(1500);
        } else {
          let credentials = {
            userName: this.userName,
            fullName: this.fullName,
            password: this.password,
            avatar: this.photoUrl,
          };
          let response = await this.register(credentials);
          if (response === 200) {
            Vue.toasted.show("Register user successfully.").goAway(1500);
            this.$router.push("/login");
          } else {
            Vue.toasted.show("Register user failed!").goAway(1500);
          }
        }
      } else {
        Vue.toasted
          .show("Require input all field before sign up!")
          .goAway(1500);
      }
    },
    ...mapActions("user", ["register"]),
  },
};
</script>

<style scoped>
.login__container {
  flex-direction: row-reverse;
}
.login__left {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}
.avatar__image {
  width: 110px;
  height: 110px;
  border: 2px solid #3ac9f5;
  display: block;
  margin: 0 auto;
  margin-bottom: 2rem;
}
.avatar__image img {
  width: 100px;
  height: 100px;
  position: relative;
  padding: 10px;
}
</style>