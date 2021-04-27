<template>
  <div class="user-container" v-on:click="letChat($event)">
    <div class="current-user-image">
      <img :src="this.currentUser.photoUrl" alt="avatar-my-self" />
    </div>
    <div class="display-name-user">
      <div class="name-user">{{ this.currentUser.displayName }}</div>
      <div class="message-user">{{ this.currentUser.currentMessage }}</div>
    </div>
    <div class="current-user-status">
      <div :class="this.currentUser.status"></div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  props: ["currentUser"],
  data: () => {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    registerAccount(event) {
      event.preventDefault();
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.username, this.password)
        .then(() => {
          this.$router.push("/").catch(() => {});
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  computed: {
    letChat: (val) => {
      console.log(val);
    },
  },
};
</script>

<style scoped>
.user-container {
  display: flex;
  flex-direction: row;
  margin-bottom: 14px;
  cursor: pointer;
}
.user-container .current-user-image img {
  border-radius: 50%;
  widows: 36px;
  height: 36px;
}
.user-container .display-name-user {
  margin-left: 12px;
  width: 50%;
}
.user-container .display-name-user .name-user {
  font-weight: 700;
  font-size: 16px;
}
.current-user-status {
  width: 30%;
}
.current-user-status .active {
  float: right;
  margin-top: 11px;
  margin-right: 5px;
  width: 6px;
  height: 6px;
  background-color: green;
  border-radius: 50%;
}
.current-user-status .de-active {
  float: right;
  margin-top: 11px;
  margin-right: 5px;
  width: 6px;
  height: 6px;
  background-color: rgb(187, 186, 186);
  border-radius: 50%;
}
</style>