<template>
  <div class="list-user-container">
    <div class="current-user">
      <div class="header-form-user">
        <div class="image-my-self" @click="signOut()">
          <img :src="this.avatarSelf" alt="avatar" class="avatar-my-self" />
        </div>
        <div class="display-name-my-self">
          <div class="name-my-self">{{ this.fullNameSelf }}</div>
          <div class="status-my-self">Active now</div>
        </div>
        <div class="logout">
          <div class="add__multi">
            <i class="fa fa-plus"></i>
          </div>
          <button class="button-logout" @click="signOut()">Logout</button>
        </div>
      </div>
      <div style="margin-top: 25px" class="pagination" />
      <div class="form-list-users">
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
                  <div class="message-user">Hello, World</div>
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
              </div>
            </div>
          </div>
          <div v-else>
            <div class="no-data">No data</div>
          </div>
        </div>
      </div>
    </div>
    <div class="content" v-if="this.currentRoom">
      <Chat :currentRoom="currentRoom" :userIdSelf="userIdSelf" />
    </div>
    <div class="content" v-else>
      <div class="new-image">
        <img :src="this.avatarSelf" alt="avatar" class="avatar-my-self" />
      </div>
      <div class="welcome">
        <h2>Welcome {{ fullNameSelf }},</h2>
        <h3>Let's spread love</h3>
      </div>
    </div>
  </div>
</template>

<script>
// import CurrentUser from "../components/CurrentUser/CurrentUser.vue";
import Chat from "../views/Chat.vue";
import { mapActions, mapGetters } from "vuex";
import Vue from "vue";
export default {
  name: "User",
  components: { Chat },
  data: () => {
    return {
      avatarSelf: localStorage.getItem("avatar"),
      fullNameSelf: localStorage.getItem("fullName"),
      userIdSelf: localStorage.getItem("userId"),
      currentUserName: localStorage.getItem("fullName"),
      currentUserPhotoUrl: localStorage.getItem("avatar"),
      currentUserId: localStorage.getItem("userId"),
      currentRoom: null,
      username: "",
      password: "",
      findUser: "",
      search: false,
      searchName: "",
    };
  },
  computed: {
    ...mapGetters("room", ["roomDetails", "currentRoomDetail"]),
    ...mapGetters("user", ["users"]),
  },
  methods: {
    async letChat(room) {
      this.currentRoom = room;
      await this.getListMessagesByRoomDetail(this.currentRoom.roomDetailId);
    },
    async signOut() {
      let resp = await this.logout();
      if (resp === 200) {
        Vue.toasted.show("Logout successfull.").goAway(1500);
        this.$router.push("/login");
      } else {
        Vue.toasted.show("Logout failed!").goAway(1500);
      }
    },
    async getUserList() {
      if (this.userIdSelf) {
        await this.getRoomByUser(this.userIdSelf);
      }
    },
    async searchUser(event) {
      event.preventDefault();
      await this.searchUsers(this.searchName);
      console.log(this.users);
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
      let credentials = {
        userFromId: this.userIdSelf,
        userToId: userTo.userId,
      };
      let response = await this.checkRoomDetailsExist(credentials);
      if (response === 200) {
        console.log(this.currentRoomDetail);
      } else {
        console.log("Tạo room đi");
      }
    },
    ...mapActions("user", ["logout", "searchUsers"]),
    ...mapActions("room", ["getRoomByUser", "checkRoomDetailsExist"]),
    ...mapActions("message", ["getListMessagesByRoomDetail"]),
  },
  created() {
    if (localStorage.getItem("userId") === null) {
      this.$router.push("/login");
    }
    this.getUserList();
  },
};
</script>

<style scoped>
.list-user-container {
  background: rgb(252, 251, 251);
  border-radius: 25px;
  width: 80vw;
  min-height: 90vh;
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
  position: absolute;
  top: 28%;
  left: 50%;
  transform: translate(-50%, -28%);
  display: flex;
  flex-direction: row;
}

/* List user left */
.list-user-container .current-user {
  width: 25vw;
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
}
.list-user-container .current-user .header-form-user {
  display: flex;
  justify-content: space-between;
}

.list-user-container .current-user .header-form-user .image-my-self {
  cursor: pointer;
}

.list-user-container
  .current-user
  .header-form-user
  .image-my-self
  img.avatar-my-self {
  border-radius: 50%;
  width: 50px;
  height: 50px;
}

.display-name-my-self {
  text-align: center;
}

.list-user-container
  .current-user
  .header-form-user
  .display-name-my-self
  .name-my-self {
  font-weight: 600;
  font-size: 20px;
  letter-spacing: 1.5px;
  text-align: center;
  font-family: "Arsenal", sans-serif;
}

.logout {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 2rem;
}

.add__multi {
  cursor: pointer;
  line-height: 2rem;
}

.list-user-container .current-user .header-form-user .logout .button-logout {
  border-radius: 1.2rem;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 10px;
  padding-right: 10px;
  margin-left: 10px;
  /* margin-top: 10px; */
  background-color: black;
  color: white;
  cursor: pointer;
  border: none;
  outline: none;
}

.list-user-container .current-user .header-form-user .logout button:hover {
  background-color: #6c63ff;
  outline: none;
}

.form-list-users {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  justify-items: center;
  height: 80vh;
}

.pagination {
  height: 1px;
  width: 100%;
  background-color: rgb(187, 179, 179);
}
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
}
.search-bar-user .input-field input {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  border: solid 1px rgb(214, 211, 211);
  outline: none;
  padding-left: 1.8rem;
  transition: box-shadow 0.5s ease-in-out;
  margin-bottom: 10px;
}
.search-bar-user .input-field input:focus {
  box-shadow: 0px 2px 8px rgba(13, 227, 255, 0.952);
}
.list-users {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

.no-data {
  font-size: 1.5rem;
  font-weight: 400;
  text-align: center;
  margin-top: 50%;
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

/* List User right */
.list-user-container .content {
  border-left: 1px solid rgb(211, 210, 208);
  width: 55vw;
  /* display: flex; */
  /* flex-direction: column; */
}

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

.user-container {
  display: flex;
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
  width: 50%;
}
.user-container .display-name-user .name-user {
  font-weight: 700;
  font-size: 16px;
  width: 200px;
  margin: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
@media screen and (max-width: 895px) {
  .display-name-my-self .status-my-self {
    display: none;
  }
  .name-my-self {
    font-size: 0.6rem;
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
    width: 100vw;
    min-height: 100vh;
    border-radius: 0px;
    box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
    position: absolute;
    top: 28%;
    left: 50%;
    transform: translate(-50%, -28%);
    display: flex;
    flex-direction: row;
  }
  .list-user-container .current-user {
    width: 26vw;
    padding: 20px 20px;
  }
  .list-user-container .content {
    border-left: 1px solid rgb(211, 210, 208);
    width: 74vw;
  }
  .user-container .display-name-user .name-user {
    font-size: 13px;
    width: 70px;
    margin-top: 4px;
  }
  .name-my-self {
    display: none;
  }
}
@media screen and (max-width: 644px) {
  .user-container .display-name-user .name-user {
    width: 40px;
  }
}
@media screen and (max-width: 540px) {
  .list-user-container .current-user .header-form-user {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .image-my-self {
    text-align: center;
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

  .list-user-container .current-user .header-form-user .logout button {
    display: none;
  }
  .search-bar-user {
    display: none;
  }
}

@media screen and (max-width: 460px) {
  .list-user-container .current-user {
    width: 20vw;
  }
  .list-user-container .content {
    width: 80vw;
  }
  .user-container .display-name-user .name-user {
    display: none;
  }
  .current-user-status {
    width: 30%;
  }
  .current-user-status .active {
    margin-top: 16px;
    margin-left: -5px;
  }
  .current-user-status .de-active {
    margin-top: 16px;
    margin-left: -5px;
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
  .list-user-container .current-user {
    width: 14vw;
  }
  .list-user-container .content {
    width: 86vw;
  }
  .current-user-status {
    display: none;
  }

  .list-user-container
    .current-user
    .header-form-user
    .image-my-self
    img.avatar-my-self {
    width: 30px;
    height: 30px;
    margin-left: -10px;
  }

  .user-container .current-user-image img {
    width: 30px;
    height: 30px;
    margin-left: -10px;
  }
}
</style>