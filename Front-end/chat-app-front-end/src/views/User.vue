<template>
  <div class="list-user-container">
    <div class="current-user">
      <div class="header-form-user">
        <div class="image-my-self" @click="goToProfile()">
          <img :src="this.user.avatar" alt="avatar" class="avatar-my-self" />
        </div>
        <div class="display-name-my-self">
          <div class="name-my-self">{{ this.user.fullName }}</div>
        </div>
        <div class="logout">
          <div class="add__multi noSelect">
            <i class="icon__menu fa fa-bars" @click="showDialog()"></i>
            <i
              class="fa fa-plus"
              @click="changeStatusAddMulti()"
              v-if="!this.statusAddMultiUser"
            ></i>
            <i class="fas fa-minus" @click="changeStatusAddMulti()" v-else></i>
          </div>
          <button class="button-logout" @click="signOut()">Logout</button>
        </div>
      </div>
      <div class="form-list-users">
        <i class="icon__exit fa fa-times" @click="hiddenDialog()"></i>
        <div class="search-bar-user" v-if="this.statusAddMultiUser">
          <div class="input-field">
            <Tags />
          </div>
        </div>
        <button
          class="button-logout"
          v-if="
            this.cartDetails &&
            this.cartDetails.length > 2 &&
            this.statusAddMultiUser
          "
          @click="createGroup"
        >
          Create
        </button>
        <div class="search-bar-user">
          <i
            class="icon__search fa fa-arrow-left"
            v-if="this.search"
            @click="changeIcon"
          ></i>
          <i class="icon__search fa fa-search" v-else @click="changeIcon"></i>
          <div class="input-field">
            <input
              type="text"
              placeholder="Enter name to search..."
              name="search-user"
              class="search-user"
              v-model="searchName"
              @focus="changeStatusFieldSearch"
              @keydown.enter="searchUser($event)"
            />
          </div>
        </div>

        <div class="list-users" v-if="!this.search">
          <div v-if="this.roomDetails.length !== 0">
            <div v-for="room in this.roomDetails" :key="room.roomDetailId">
              <div class="user-container" v-on:click="letChat(room)">
                <div class="current-user-image">
                  <img :src="room.roomAvatar" alt="avatar-room" />
                </div>
                <div class="display-name-user">
                  <div class="name-user">{{ room.roomName }}</div>
                  <div
                    class="message-user"
                    v-if="user.userId !== room.sender && room.content !== null"
                  >
                    {{ room.fullName }}: {{ room.content }}
                  </div>
                  <div
                    class="message-user"
                    v-else-if="
                      user.userId === room.sender && room.content !== null
                    "
                  >
                    You: {{ room.content }}
                  </div>
                  <div class="message-user" v-else>Let's chat now!</div>
                </div>
                <div class="current-user-status">
                  <div :class="true"></div>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="no-data">No data</div>
          </div>
        </div>
        <div class="list-users" v-else>
          <div v-if="this.users.length !== 0">
            <div v-for="user in this.users" :key="user.userId">
              <div
                class="user-container"
                v-on:click="checkExistAndletChat(user)"
              >
                <div class="current-user-image">
                  <img :src="user.avatar" alt="avatar-room" />
                </div>
                <div class="display-name-user">
                  <div class="name-user">{{ user.fullName }}</div>
                </div>
                <div class="current-user-status">
                  <i class="icon__search fa fa-plus-circle"></i>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="no-data">No data</div>
          </div>
        </div>
      </div>
    </div>
    <div class="content" v-if="this.currentRoomDetail">
      <Chat :currentRoom="currentRoomDetail" :userIdSelf="this.user.userId" />
    </div>
    <div class="content content__no__message" v-else>
      <div class="new-image">
        <img :src="this.user.avatar" alt="avatar" class="avatar-my-self" />
      </div>
      <div class="welcome">
        <h2>Welcome {{ this.user.fullName }},</h2>
        <h3>Let's spread love</h3>
      </div>
    </div>
  </div>
</template>

<script>
// import CurrentUser from "../components/CurrentUser/CurrentUser.vue";
import Chat from "../views/Chat.vue";
import Tags from "../components/tags/TagsInput.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import Vue from "vue";
import $ from "jquery";
export default {
  name: "User",
  components: { Chat, Tags },
  data: () => {
    return {
      username: "",
      password: "",
      findUser: "",
      search: false,
      searchName: "",
      statusAddMultiUser: false,
      roomName: "",
      photoUrl:
        "https://gravatar.com/avatar/5adc5ab6ae861c87e576946e9e521675?s=400&d=robohash&r=x",
      checkMenuVisible: false,
    };
  },
  computed: {
    ...mapGetters("room", ["roomDetails", "currentRoomDetail"]),
    ...mapGetters("user", ["users", "user"]),
    ...mapGetters("cart", ["cart", "cartDetails"]),
  },
  sockets: {
    connection: function () {
      console.log("socket connected");
    },
  },
  methods: {
    goToProfile() {
      this.$router.push("/profile");
    },
    showDialog() {
      this.checkMenuVisible = true;
      $(".form-list-users").css("display", "flex");
      $(".icon__exit").css("visibility", "visible");
    },
    hiddenDialog() {
      this.checkMenuVisible = false;
      $(".form-list-users").css("display", "none");
      $(".icon__exit").css("visibility", "hidden");
      this.statusAddMultiUser = false;
    },
    async letChat(room) {
      await this.setMessages("");
      await this.getListMessagesByRoomDetail(room.roomDetailId);
      await this.setCurrentRoomDetail(room);
      if (this.checkMenuVisible) {
        this.hiddenDialog();
      }
      this.$socket.emit("leave");
      this.$socket.emit("createRoom", room);
    },
    async signOut() {
      let resp = await this.logout();
      if (resp === 200) {
        this.setEmpty();
        Vue.toasted.show("Logout successfull.").goAway(1500);
        this.$router.push("/login");
      } else {
        Vue.toasted.show("Logout failed!").goAway(1500);
      }
    },
    setEmpty() {
      this.setUser("");
      this.setCurrentRoomDetail("");
      this.setMessages("");
      this.setCartDetails("");
      this.setRoomDetails("");
      this.addUsers("");
    },
    async getUserList() {
      if (this.user.userId) {
        await this.getRoomByUser(this.user.userId);
      }
    },
    async searchUser(event) {
      event.preventDefault();
      let credentials = {
        userId: this.user.userId,
        searchName: this.searchName,
      };
      await this.searchUsers(credentials);
    },
    changeIcon() {
      if (this.search) {
        this.search = false;
        this.searchName = "";
      } else {
        this.search = true;
      }
    },
    changeStatusFieldSearch() {
      if (!this.search) {
        this.search = true;
      }
    },
    async checkExistAndletChat(userTo) {
      if (!this.statusAddMultiUser) {
        let credentials = {
          userFromId: this.user.userId,
          userToId: userTo.userId,
        };
        let response = await this.checkRoomDetailsExist(credentials);
        if (response === 200) {
          this.letChat(this.currentRoomDetail);
        } else {
          let newRoomDetail = {
            roomNameFrom: this.user.fullName,
            roomNameTo: userTo.fullName,
            roomAvatarFrom: this.user.avatar,
            roomAvatarTo: userTo.avatar,
            userFromId: this.user.userId,
            userToId: userTo.userId,
          };
          let response = await this.createRoomDetails(newRoomDetail);
          if (response === 200) {
            Vue.toasted.show("Create new room successfully").goAway(1500);
            this.letChat(this.currentRoomDetail);
          } else {
            Vue.toasted.show("Create new room failed").goAway(1500);
          }
        }
      } else {
        this.addUserInCartExisted(userTo);
      }
    },
    async changeStatusAddMulti() {
      if (!this.statusAddMultiUser) {
        this.statusAddMultiUser = true;
        let response = await this.getCartByUserId(this.user.userId);
        if (response === 200) {
          this.getAllCartDetails();
        } else {
          this.createCartByUser();
        }
      } else {
        this.statusAddMultiUser = false;
      }
    },
    async addUserInCartExisted(userTo) {
      if (this.cart) {
        let credentials = {
          cartId: this.cart.cartId,
          userId: userTo.userId,
          ownerId: this.cart.ownerId,
          fullName: userTo.fullName,
        };
        let response = await this.addUserInCart(credentials);

        if (response === 200) {
          Vue.toasted.show("Add user to cart successfully").goAway(1500);
        } else {
          Vue.toasted
            .show("Check user have been existed in cart!")
            .goAway(1500);
        }
      }
    },
    async createCartByUser() {
      let credentials = {
        ownerId: this.user.userId,
        fullName: this.user.fullName,
      };
      let response = await this.createNewCart(credentials);
      if (response === 200) {
        Vue.toasted.show("Create new cart successfully").goAway(1500);
        this.getAllCartDetails();
      } else {
        Vue.toasted.show("Create new cart failed!").goAway(1500);
      }
    },
    async getAllCartDetails() {
      if (this.cart) {
        let response = await this.getCartDetails(this.cart.cartId);
        if (response === 200) {
          Vue.toasted.show("Get successful").goAway(1500);
        }
      }
    },
    async createGroup() {
      this.roomName = prompt("What is your group name?", "New Group");
      if (!this.roomName) {
        this.roomName = "New Group";
      }
      let credentials = {
        cartId: this.cart.cartId,
        roomAvatar: this.photoUrl,
        roomName: this.roomName,
      };
      let response = await this.createNewGroup(credentials);
      if (response === 200) {
        Vue.toasted.show("Create new group successfully").goAway(1500);
        await this.getUserList();
        await this.setMessages("");
        this.statusAddMultiUser = false;
        this.searchName = "";
        this.search = false;
      } else {
        Vue.toasted.show("Create new group failed!").goAway(1500);
      }
    },
    ...mapActions("user", ["logout", "searchUsers"]),
    ...mapActions("room", [
      "getRoomByUser",
      "createRoomDetails",
      "checkRoomDetailsExist",
      "createNewGroup",
    ]),
    ...mapActions("message", ["getListMessagesByRoomDetail"]),
    ...mapActions("cart", [
      "getCartByUserId",
      "createNewCart",
      "addUserInCart",
      "getCartDetails",
    ]),
    ...mapMutations("room", ["setCurrentRoomDetail", "setRoomDetails"]),
    ...mapMutations("message", ["setMessages"]),
    ...mapMutations("cart", ["setCartDetails"]),
    ...mapMutations("user", ["setUser", "addUsers"]),
  },
  created() {
    if (localStorage.getItem("userId") === null) {
      this.$router.push("/login");
    }
    this.getUserList();
    console.log(this.roomDetails);
    window.onbeforeunload = () => {
      this.$socket.emit("leave");
    };
    if (this.currentRoomDetail) {
      this.$socket.emit("createRoom", this.currentRoomDetail);
    }
  },
};
</script>

<style scoped>
.list-user-container {
  background: rgb(252, 251, 251);
  border-radius: 25px;
  max-width: 80vw;
  height: 90vh;
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
  margin: 0.2rem auto;
  display: flex;
  flex-direction: row;
}

/* List user left */

.list-user-container .current-user {
  max-width: 25vw;
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

/* Header column user left */
.content__no__message {
  flex-direction: column;
}
.current-user .header-form-user {
  flex-direction: column;
  justify-content: center;
  justify-items: center;
  max-height: 18vh;
  flex-grow: 1;
}

.header-form-user .image-my-self {
  cursor: pointer;
  text-align: center;
}

.header-form-user .image-my-self img.avatar-my-self {
  border-radius: 50%;
  width: 50px;
  height: 50px;
}

.display-name-my-self {
  text-align: center;
  margin-left: 4px;
}

.display-name-my-self .name-my-self {
  letter-spacing: 1px;
  text-align: center;
  white-space: nowrap;
  font-family: "Arsenal", sans-serif;
  font-weight: 600;
  font-size: 14px;
  /* width: 80px; */
  margin: auto;
}

/* Logout Header */

.logout {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 2rem;
  text-align: center;
  margin-bottom: 1rem;
  margin-left: 4px;
}

.add__multi {
  cursor: pointer;
  line-height: 2rem;
  margin-left: 4px;
  width: fit-content;
  margin: 0 auto;
}

.header-form-user .logout .button-logout {
  border-radius: 1.2rem;
  width: 40%;
  padding: 2px 2px;
  background-color: black;
  color: white;
  border: none;
  outline: none;
  margin: 0 auto;
}

.logout .button-logout:hover {
  background-color: #6c63ff;
  outline: none;
  cursor: pointer;
}

/* Current User Column User left */

.form-list-users {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  justify-items: center;
  max-height: 65vh;
  flex-grow: 1;
}

.icon__menu {
  display: none;
}

.icon__exit {
  margin-left: auto;
  margin-top: 0.6rem;
  margin-right: 0.6rem;
  cursor: pointer;
  transition: transform 1s ease-in-out;
  visibility: hidden;
}

.icon__exit:hover {
  transform: rotate(360deg);
}

.icon__exit:focus {
  transform: rotate(360deg);
}

/* Search bar */

.search-bar-user {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  position: relative;
}

.search-bar-user .icon__search {
  position: absolute;
  top: 50%;
  left: 4%;
  transform: translate(-4%, -50%);
  cursor: pointer;
}

.search-bar-user .input-field {
  width: 100%;
  margin-left: 4px;
  background-color: white;
}

.search-bar-user .input-field input {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  border: 1px solid rgb(214, 211, 211);
  outline: none;
  padding-left: 1.8rem;
  transition: box-shadow 0.5s ease-in-out;
  margin-bottom: 10px;
}

.search-bar-user .input-field input:focus {
  box-shadow: 0px 2px 8px rgba(13, 227, 255, 0.952);
}

/* List Current User Column User left */

.list-users {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  flex-grow: 1;
  overflow-y: scroll;
  overflow-x: hidden;
  margin-bottom: 10px;
}

.list-users::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
  border-radius: 5px;
}

.list-users::-webkit-scrollbar {
  width: 6px;
  background-color: #f5f5f5;
}

.list-users::-webkit-scrollbar-thumb {
  background-color: #0ae;
  border-radius: 5px;
  background-image: -webkit-gradient(
    linear,
    0 0,
    0 100%,
    color-stop(0.5, rgba(255, 255, 255, 0.2)),
    color-stop(0.5, transparent),
    to(transparent)
  );
}

.no-data {
  font-size: 1.5rem;
  font-weight: 300;
  text-align: center;
  margin-top: 50%;
}

.user-container {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  margin-bottom: 14px;
  cursor: pointer;
}
.user-container .current-user-image {
  width: 38px;
  box-sizing: border-box;
}
.user-container .current-user-image img {
  border-radius: 50%;
  width: 38px;
  height: 38px;
}
.user-container .display-name-user {
  margin-left: 12px;
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.user-container .display-name-user .name-user {
  font-weight: 600;
  font-size: 15px;
  width: 100px;
  margin: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-user {
  font-size: 12.5px;
  width: 100px;
  margin: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.current-user-status {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 3rem;
}

/* List User right */
.list-user-container .content {
  border-left: 1px solid rgb(211, 210, 208);
  flex-grow: 1;
  display: flex;
}

/* Column Right with no message */

.content .new-image {
  display: block;
  margin: 0 auto;
  text-align: center;
  margin-top: 10%;
}

.content .new-image .avatar-my-self {
  border-radius: 50%;
  width: 200px;
  height: 200px;
}

.content .welcome {
  display: block;
  margin: 0 auto;
  justify-content: center;
  text-align: center;
  margin-top: 30px;
}

.noSelect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

@media screen and (max-width: 760px) {
  .list-user-container {
    background: rgb(252, 251, 251);
    border-radius: 0;
    max-width: 100vw;
    height: 100vh;
    box-shadow: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    flex-grow: 1;
  }
  .list-user-container .current-user {
    width: 26vw;
    padding: 10px 4px 10px 10px;
  }
  .search-user {
    font-size: 10px;
  }
  .user-container .current-user-image {
    width: 20%;
  }
  .user-container .current-user-image img {
    width: 28px;
    height: 28px;
  }
  .user-container .display-name-user {
    margin-left: 10px;
    width: 50%;
  }
  .user-container .display-name-user .name-user {
    font-size: 12px;
    width: 68px;
  }

  .form-list-users {
    max-height: 75vh;
    flex-grow: 1;
  }

  .message-user {
    width: 100px;
  }

  .display-name-my-self .name-my-self {
    font-size: 13px;
    padding-top: 10px;
    width: 100%;
    margin: auto;
  }
  .list-user-container .content {
    border-left: 1px solid rgb(211, 210, 208);
    width: 74vw;
  }

  .add__multi {
    line-height: 1.5rem;
    margin: 4px auto;
  }
}
@media screen and (max-width: 644px) {
  .user-container .display-name-user .name-user {
    width: 40px;
  }
  .content .new-image {
    margin-top: 20%;
  }

  .content .new-image .avatar-my-self {
    width: 150px;
    height: 150px;
  }

  .content .welcome {
    margin-top: 50px;
  }
  .header-form-user .logout .button-logout {
    width: fit-content;
  }
}
@media screen and (max-width: 600px) {
  /* Logout Header */

  .header-form-user .logout .button-logout {
    border-radius: 5px;
    padding: 3px 10px;
    margin: 0 auto;
    font-size: 14px;
  }
}
@media screen and (max-width: 540px) {
  .list-user-container {
    flex-direction: column;
  }
  .list-user-container .current-user {
    width: 100vw;
    max-width: 100vw;
    max-height: 15vh;
    flex-direction: row;
    padding: 10px 10px 0 10px;
    flex-grow: 1;
    border-bottom: 1px solid rgb(211, 210, 208);
  }
  .current-user .header-form-user {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .display-name-my-self .name-my-self {
    font-size: 1.3rem;
    padding-top: 5px;
    width: 180px;
    margin: auto;
    margin-bottom: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .icon__menu {
    display: inline-block;
    margin-right: 1rem;
  }
  .logout {
    flex-direction: row;
  }
  .header-form-user .logout .button-logout {
    margin-left: 1rem;
  }

  .list-user-container .content {
    border: none;
    width: 100vw;
  }

  .button-logout {
    font-size: 10px;
  }

  .form-list-users {
    background-color: whitesmoke;
    position: absolute;
    top: 15%;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 9999;
    display: none;
  }
  .search-bar-user {
    margin-top: 1rem;
    outline: none;
    border: none;
  }
  .search-bar-user .icon__search {
    top: 50%;
    left: 2%;
    transform: translate(-2%, -50%);
  }
  .search-bar-user .input-field .search-user {
    border: none;
    outline: none;
  }
  .user-container .current-user-image {
    text-align: center;
    margin: auto;
    margin-right: 0;
    margin-left: 0;
  }
  .user-container .current-user-image img {
    width: 42px;
    height: 42px;
  }

  .user-container .display-name-user {
    margin-left: 0;
  }

  .user-container .display-name-user .name-user {
    width: 200px;
    font-size: 19px;
  }

  .message-user {
    width: 200px;
  }
}

@media screen and (max-width: 460px) {
  .current-user-status {
    width: 30%;
  }

  .content .new-image .avatar-my-self {
    width: 150px;
    height: 150px;
  }
  .content .new-image {
    margin-top: 40%;
  }

  .content .welcome h2 {
    font-size: 1.2rem;
  }
  .content .welcome h3 {
    font-size: 1rem;
  }
  .header-form-user .logout .button-logout {
    padding: 3px 5px;
    font-size: 12px;
  }
}
@media screen and (max-width: 360px) {
  .display-name-my-self .name-my-self {
    font-size: 1rem;
    padding-top: 5px;
    width: 100px;
  }
  .header-form-user .image-my-self img.avatar-my-self {
    width: 40px;
    height: 40px;
  }
  .content .new-image .avatar-my-self {
    width: 100px;
    height: 100px;
  }
  .content .new-image {
    margin-top: 60%;
  }

  .content .welcome {
    margin-top: 40px;
  }

  .header-form-user .logout .button-logout {
    padding: 3px 5px;
    font-size: 10px;
    margin: 0 0.4rem 0 0.8rem;
  }
}
</style>