<template>
  <div class="main__container login__container">
    <div class="login__left" data-aos="fade-left" data-aos-duration="2000">
      <div class="login__left__title">
        <div class="title__icon"><i class="fab fa-vuejs"></i></div>
        <div class="title__text">Dripella</div>
      </div>
      <div class="login__left__info">
        <h1 class="login__welcome">Hello, Friend!</h1>
        <p class="login__connect">
          Enter your personal details and start journey with us
        </p>
        <div class="btn btn__rounded btn__absolute" @click="goToRegister">
          Sign up
        </div>
      </div>
    </div>
    <div class="login__right" data-aos="fade-right" data-aos-duration="2000">
      <div class="login__right__container">
        <h2 class="login__right__title">Sign in to Driprella</h2>
        <ul class="login__social__list">
          <li class="login__social__item">
            <a href="https://www.facebook.com/pham.vn.7/" style="color: white"
              ><i class="fab fa-facebook"></i
            ></a>
          </li>
          <li class="login__social__item">
            <a
              href="https://mail.google.com/mail/u/0/?tab=rm#inbox"
              style="color: white"
            >
              <i class="fab fa-google-plus-g"></i
            ></a>
          </li>
          <li class="login__social__item">
            <i class="fab fa-linkedin-in"></i>
          </li>
        </ul>
        <div class="another__login">or use your email account:</div>
        <div class="form__login">
          <form action="#" class="form__login__container">
            <div class="field__input">
              <i class="icon__input fa fa-user"></i>
              <input
                type="text"
                class="input email__text__field"
                placeholder="Username"
                v-model="userName"
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
            <div class="forgot__pass">Forgot your password?</div>
            <button
              class="btn btn__rounded btn__signin"
              @click="loginWithUserNameAndPassword($event)"
            >
              Sign In
            </button>
            <button
              class="button__signup btn btn__rounded"
              @click="goToRegister"
            >
              Sign up
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
  name: "Login",
  data: () => ({
    userName: "",
    password: "",
  }),
  methods: {
    async loginWithUserNameAndPassword(event) {
      this.$socket.emit("test", "Test Who");
      event.preventDefault();
      if (this.userName && this.password) {
        var credential = {
          userName: this.userName,
          password: this.password,
        };
        let statusResp = await this.login(credential);
        if (statusResp == 200) {
          Vue.toasted.show("Login successful.").goAway(1500);
          this.$router.push("/users");
        } else {
          Vue.toasted.show("Login failed!").goAway(1500);
        }
      } else {
        Vue.toasted.show("Require input all field!").goAway(1500);
      }
    },
    goToRegister() {
      this.$router.push("/register");
    },
    ...mapActions("user", ["login"]),
  },
};
</script>

<style >
.login__container {
  width: 60%;
  min-height: 80vh;
  background-color: rgb(250, 250, 250);
  margin: 2rem auto;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.login__left {
  width: 40%;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  background-image: linear-gradient(
    rgba(41, 224, 24, 0.8),
    rgba(51, 255, 0, 0.75)
  );
  position: relative;
}
.login__left__title {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  margin: 1rem 2rem;
}
.title__icon {
  margin-right: 0.5rem;
  padding: 5px;
  border: 1px solid white;
}
.title__text {
  padding: 5px;
}
.login__left__info {
  position: absolute;
  top: 40%;
  left: 0;
  transform: translateY(-40%);
}

.login__welcome {
  text-align: center;
  color: white;
  padding: 10px;
}

.login__connect {
  text-align: center;
  color: white;
  width: 70%;
  margin: 0 auto;
  line-height: 1.6;
}

.btn {
  cursor: pointer;
  display: inline-block;
  padding: 1rem 2.5rem;
  margin-top: 40px;
  text-transform: uppercase;
  font-size: 0.8rem;
  transition: all 0.2s ease-in-out;
}
.button__signup {
  display: none;
}
.btn__rounded {
  border-radius: 4rem;
  border: 1px solid white;
  color: white;
}

.btn__rounded:active {
  padding: 1rem 3rem;
  border: 2px solid white;
}

.btn__absolute {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}

.login__right {
  width: 60%;
}

.login__right__container {
  width: 80%;
  margin-left: 10%;
  margin-right: 10%;
  min-height: 50vh;
  margin-top: 2vh;
  text-align: center;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  justify-items: center;
}
.login__right__title {
  font-size: 2rem;
  color: blue;
  padding: 10px 18px;
}
.login__social__list {
  display: flex;
  flex-direction: row;
  list-style: none;
  justify-content: center;
  margin-bottom: 1.6rem;
}
.login__social__item {
  margin-left: 2rem;
  font-size: 1.6em;
  width: 1.6em;
  text-align: center;
  line-height: 1.6em;
  background: #666;
  color: #fff;
  border-radius: 0.8em; /* or 50% width & line-height */
  cursor: pointer;
}
.login__social__item:first-child {
  margin-left: -2rem;
}
.login__social__item:active {
  background-color: rgb(72, 250, 27);
  color: white;
}

.another__login {
  font-size: 0.8rem;
  color: rgb(175, 173, 173);
  margin-bottom: 1.2rem;
}

.form__login {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.field__input {
  position: relative;
  margin-bottom: 1.4rem;
}
.input {
  width: 65%;
  padding: 14px;
  padding-left: 32px;
  border: none;
}
.icon__input {
  position: absolute;
  top: 50%;
  left: 20%;
  transform: translate(-20%, -50%);
}

.forgot__pass {
  font-weight: 700;
  font-size: 0.8rem;
  padding-bottom: 0.6rem;
  padding-top: 0.4rem;
  display: inline-block;
  /* border-bottom: 1px solid black; */
  margin-bottom: 1.4rem;
  position: relative;
}

.forgot__pass::after {
  position: absolute;
  content: "";
  background-color: rgba(35, 35, 240, 0.6);
  width: 100%;
  height: 1.5px;
  top: 100%;
  left: 0;
  transform: translateY(-100%);
}
.btn__signin {
  display: block;
  margin: 0 auto;
  background-color: rgb(35, 35, 240);
}

@media only screen and (max-width: 670px) {
  .login__container {
    width: 100%;
    min-height: 100vh;
    margin: 10px auto;
    border-radius: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .login__left {
    display: none;
  }

  .btn {
    padding: 0.8rem 2rem;
    margin-top: 20px;
    font-size: 0.8rem;
  }
  .button__signup {
    display: inline-block;
  }

  .btn__rounded:active {
    padding: 0.8rem 2rem;
  }

  .login__right {
    width: 100%;
  }

  .login__right__container {
    width: 80%;
    margin-left: 10%;
    margin-right: 10%;
    margin-top: 2vh;
  }

  .input {
    padding: 8px;
    padding-left: 30px;
  }

  .forgot__pass {
    display: block;
    width: 60%;
    margin: 0 auto;
  }

  .btn__signin {
    display: inline-block;
    margin: 0 auto;
    background-color: rgb(35, 35, 240);
    margin-right: 1rem;
  }
}
@media only screen and (max-width: 350px) {
  .btn {
    padding: 0.6rem 1.5rem;
  }
  .login__right__title {
    font-size: 1.6rem;
    padding: 6px 10px;
  }
}
@media only screen and (max-width: 310px) {
  .btn__signin {
    display: block;
    margin: 0 auto;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .button__signup {
    display: block;
    margin: 0 auto;
  }
}
</style>