<template>
  <div class="list-user-container">
    <div class="current-user">
      <div class="header-form-user">
        <div class="image-my-self" @click="signOut()">
          <img :src="this.user.avatar" alt="avatar" class="avatar-my-self" />
        </div>
        <div class="display-name-my-self">
          <div class="name-my-self">{{ this.user.fullName }}</div>
          <div class="status-my-self">Active now</div>
        </div>
        <div class="logout">
          <div class="add__multi" @click="changeStatusAddMulti()">
            <i class="fa fa-plus" v-if="!this.statusAddMultiUser"></i>
            <i class="fas fa-minus" v-else></i>
          </div>
          <button class="button-logout" @click="signOut()">Logout</button>
        </div>
      </div>
      <div style="margin-top: 25px" class="pagination" />
      <div class="form-list-users">
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
        <div class="search-bar-user" v-if="this.search">
          <div class="back__room__detail">
            <i class="icon__back fa fa-arrow-left" @click="changeIcon"></i>
            <div class="input-field">
              <input
                type="text"
                placeholder="Enter name to search..."
                name="search-user"
                class="search-user"
                v-model="searchName"
                ref="inputSearchName"
                @keydown.enter="searchUser($event)"
              />
            </div>
          </div>
        </div>
        <div class="search-bar-user" v-else>
          <i class="icon__search fa fa-search"></i>
          <div class="input-field">
            <input
              type="text"
              placeholder="Enter name to search..."
              name="search-user"
              class="search-user"
              v-model="searchName"
              @focus="changeIcon"
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
                  <div class="message-user">{{ room.content }}</div>
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
    <div class="content" v-else>
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
    async letChat(room) {
      await this.getListMessagesByRoomDetail(room.roomDetailId);
      await this.setCurrentRoomDetail(room);
      this.$socket.emit("leave");
      this.$socket.emit("createRoom", room);
    },
    async signOut() {
      let resp = await this.logout();
      if (resp === 200) {
        this.setCurrentRoomDetail("");
        this.setMessages("");
        this.setCartDetails("");
        this.setRoomDetails("");
        Vue.toasted.show("Logout successfull.").goAway(1500);
        this.$router.push("/login");
      } else {
        Vue.toasted.show("Logout failed!").goAway(1500);
      }
    },
    async getUserList() {
      if (this.user.userId) {
        await this.getRoomByUser(this.user.userId);
      }
    },
    async searchUser(event) {
      event.preventDefault();
      await this.searchUsers(this.searchName);
    },
    changeIcon() {
      if (this.search) {
        this.search = false;
        this.searchName = "";
      } else {
        this.search = true;
      }
    },
    async checkExistAndletChat(userTo) {
      if (!this.statusAddMultiUser) {
        let credentials = {
          userFromId: this.userIdSelf,
          userToId: userTo.userId,
        };
        let response = await this.checkRoomDetailsExist(credentials);
        if (response === 200) {
          this.letChat(this.currentRoomDetail);
          this.$socket.emit("createRoom", this.currentRoomDetail);
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
            Vue.toasted.show("Create new room failed!").goAway(1500);
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
        if (response !== 200) {
          this.createCartByUser();
        } else {
          this.getAllCartDetails();
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
        if (response !== 200) {
          Vue.toasted
            .show("Check user have been existed in cart!")
            .goAway(1500);
        } else {
          Vue.toasted.show("Add user to cart successfully").goAway(1500);
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
      this.roomName = prompt("What is you group name?", "New Group");
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
  },
  created() {
    if (localStorage.getItem("userId") === null) {
      this.$router.push("/login");
    }
    this.getUserList();

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

.current-user {
  max-width: 25vw;
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
}

/* Header column user left */

.current-user .header-form-user {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  flex-grow: 1;
}

.header-form-user .image-my-self {
  cursor: pointer;
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
  font-weight: 600;
  font-size: 1.3rem;
  letter-spacing: 1.5px;
  text-align: center;
  font-family: "Arsenal", sans-serif;
}

/* Logout Header */

.logout {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 2rem;
  margin-left: 4px;
}

.add__multi {
  cursor: pointer;
  line-height: 2rem;
  margin-left: 4px;
}

.header-form-user .logout .button-logout {
  border-radius: 1.2rem;
  padding: 2px 10px;
  margin-left: 10px;
  background-color: black;
  color: white;
  border: none;
  outline: none;
}

.logout .button-logout:hover {
  background-color: #6c63ff;
  outline: none;
}

/* Pagination between header and current user column user left */

.pagination {
  height: 1px;
  width: 100%;
  background-color: rgb(187, 179, 179);
  /* flex-grow: 1; */
}

/* Current User Column User left */

.form-list-users {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  justify-items: center;
  max-height: 68vh;
  flex-grow: 1;
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

.back__room__detail {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  position: relative;
}

.back__room__detail .icon__back {
  position: absolute;
  left: 2%;
  top: 50%;
  transform: translate(-2%, -50%);
  cursor: pointer;
  margin-right: 2rem;
}

.back__room__detail .input-field {
  flex-grow: 1;
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
.user-container .current-user-image img {
  border-radius: 50%;
  width: 38px;
  height: 38px;
}
.user-container .display-name-user {
  margin-left: 12px;
}
.user-container .display-name-user .name-user {
  font-weight: 600;
  font-size: 15px;
  width: 200px;
  margin: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-user {
  font-size: 12.5px;
}

.current-user-status {
  width: 30%;
  display: flex;
  margin-right: 1rem;
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

@media screen and (max-width: 914px) {
  .display-name-my-self .status-my-self {
    display: none;
  }
  .name-my-self {
    font-size: 8px;
    padding-top: 10px;
    width: 50px;
    margin: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
@media screen and (max-width: 815px) {
  .user-container .display-name-user .name-user {
    font-weight: 600;
    font-size: 14px;
    width: 100px;
    margin-top: 4px;
  }
  .logout {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 2rem;
    text-align: center;
    margin-bottom: 1rem;
  }

  .add__multi {
    cursor: pointer;
    line-height: 2rem;
  }
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
  }
  .list-user-container .current-user {
    width: 26vw;
    padding: 20px 20px;
  }
  .current-user .header-form-user {
    flex-direction: column;
    justify-content: center;
    justify-items: center;
  }
  .header-form-user .image-my-self {
    text-align: center;
  }

  .name-my-self {
    font-size: 8px;
    padding-top: 10px;
    width: 100%;
    margin: auto;
  }
  .list-user-container .content {
    border-left: 1px solid rgb(211, 210, 208);
    width: 74vw;
  }
  .user-container .display-name-user .name-user {
    font-size: 13px;
    width: 70px;
    margin-top: 2px;
  }
  .list-users {
    height: 60vh;
  }
}
@media screen and (max-width: 644px) {
  .current-user {
    padding: 10px 10px;
  }
  .user-container .display-name-user .name-user {
    width: 40px;
  }
}
@media screen and (max-width: 540px) {
  .current-user .header-form-user {
    height: 5vh;
  }
  .add__multi {
    display: none;
  }

  .header-form-user .logout {
    display: none;
  }
  .search-bar-user {
    display: none;
  }
  .search-bar-user {
    display: none;
  }
  .list-users {
    height: 80vh;
  }
  .display-name-my-self .name-my-self {
    font-size: 14px;
    padding-top: 5px;
    width: 80px;
    margin: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media screen and (max-width: 460px) {
  .list-user-container .current-user {
    padding: 5px 2px 5px 5px;
  }
  .display-name-my-self {
    margin-left: 0;
  }

  .current-user-status {
    width: 30%;
  }
  .pagination {
    width: 110%;
  }
  .content .new-image .avatar-my-self {
    width: 150px;
    height: 150px;
  }

  .content .welcome {
    margin-top: 40px;
  }
  .content .welcome h2 {
    font-size: 26px;
  }
  .content .welcome h3 {
    font-size: 24px;
  }
}
@media screen and (max-width: 360px) {
  .user-container .display-name-user {
    display: none;
  }
  .display-name-my-self .name-my-self {
    font-size: 9px;
    padding-top: 2px;
    margin: 0;
    margin-left: 8px;
    width: 50px;
  }
}
</style>