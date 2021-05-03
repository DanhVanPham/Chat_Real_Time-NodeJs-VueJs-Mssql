<template>
  <div class="chat-box">
    <div class="chat-box-header">
      <img :src="this.currentRoom.roomAvatar" alt="user" class="avatar" />
      <h6>{{ this.currentRoom.roomName }}</h6>
    </div>
    <div class="chat-box-message">
      <MessageList
        :chatMessages="this.messages"
        :currentRoom="currentRoom"
      ></MessageList>
      <div class="typing" v-if="this.nameTyping">{{ this.nameTyping }}</div>
      <div ref="scrollable"></div>
    </div>
    <form class="chat-box-input">
      <div class="input-field">
        <input
          type="text"
          placeholder="Input messages..."
          name="message"
          class="input message"
          v-model="message"
          @keydown.enter="sendMessage($event)"
        />
        <button
          class="icon"
          :disabled="!this.message"
          @click="sendMessage($event)"
        >
          <img src="../assets/send.png" alt="Send" />
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import MessageList from "../components/MessageList/MessageList.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  components: { MessageList },
  props: ["currentRoom", "userIdSelf"],
  data: () => ({
    message: "",
    nameTyping: false,
  }),
  computed: {
    ...mapGetters("room", ["roomDetails", "checkRoomDetailsExist"]),
    ...mapGetters("message", ["messages"]),
    ...mapGetters("user", ["user"]),
  },
  updated: function () {
    this.$refs["scrollable"].scrollIntoView({ behavior: "smooth" });
  },
  watch: {
    chatMessages: function (newVal, oldVal) {
      if (newVal != oldVal) {
        this.$refs["scrollable"].scrollIntoView({ behavior: "smooth" });
      }
    },
    message(value) {
      value !== ""
        ? this.$socket.emit("typing", {
            sender: this.user.fullName,
            roomId: this.currentRoom.roomId,
          })
        : this.$socket.emit("stopTyping", this.currentRoom.roomId);
    },
  },
  sockets: {
    received: function (data) {
      this.addMessage(data);
      this.$refs["scrollable"].scrollIntoView({ behavior: "smooth" });
    },
    typing: function (data) {
      this.nameTyping = data;
    },
    stopTyping: function () {
      this.nameTyping = false;
    },
    latestMessageInCurrentRoomDetails: async function (data) {
      var index = await this.checkRoomDetailsExist(data.roomId);
      if (index !== -1) {
        data["index"] = index;
        this.setMessagesRoomDetails(data);
      }
    },
  },
  methods: {
    async sendMessage(event) {
      event.preventDefault();
      if (this.message) {
        let credential = {
          content: this.message,
          sender: this.user.userId,
          roomId: this.currentRoom.roomId,
        };
        let response = await this.createMessage(credential);
        if (response === 200) {
          this.$socket.emit("message", {
            content: this.message,
            sender: this.user.userId,
            fullName: this.user.fullName,
            avatar: this.user.avatar,
            roomId: this.currentRoom.roomId,
          });
          this.$socket.emit("latestMessageInCurrentRoomDetails", {
            content: this.message,
            sender: this.user.userId,
            fullName: this.user.fullName,
            roomId: this.currentRoom.roomId,
          });
          this.message = "";
        }
      }
      this.$refs["scrollable"].scrollIntoView({ behavior: "smooth" });
    },
    ...mapActions("message", ["getListMessagesByRoomDetail", "createMessage"]),
    ...mapMutations("message", ["addMessage"]),
    ...mapMutations("room", ["setMessagesRoomDetails"]),
  },
  async created() {
    await this.getListMessagesByRoomDetail(this.currentRoom.roomDetailId);
    this.$refs["scrollable"].scrollIntoView({ behavior: "smooth" });
  },
};
</script>

<style scoped>
/* Chat box Right */

.chat-box {
  width: 100%;
  height: 100%;
  background: rgb(252, 251, 251);
  border-top-right-radius: 32px;
  border-bottom-right-radius: 16px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
}

/* Chat box header */

.chat-box-header {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 10vh;
  border-bottom: 1px solid #dee1e2;
  box-sizing: border-box;
  flex-grow: 1;
}

.chat-box-header .avatar {
  width: 20%;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin: 0 10px;
}

.chat-box-header h6 {
  font-size: 24px;
  font-weight: 600;
  margin-left: 5px;
}

/* Chat box message */

.chat-box-message {
  height: 75vh;
  overflow: auto;
  flex-grow: 1;
}

.chat-box-message::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
}

.chat-box-message::-webkit-scrollbar {
  width: 8px;
  background-color: #f5f5f5;
}

.chat-box-message::-webkit-scrollbar-thumb {
  background-color: #0ae;
  background-image: -webkit-gradient(
    linear,
    0 0,
    0 100%,
    color-stop(0.5, rgba(255, 255, 255, 0.2)),
    color-stop(0.5, transparent),
    to(transparent)
  );
}

.typing {
  font-size: 0.8rem;
  margin-left: 10px;
}

/* Chat box input */

.chat-box-input {
  flex-grow: 1;
  height: auto;
  background-color: transparent;
  border-bottom-right-radius: 16px;
  border-top: 1px solid #dee1e2;
}

.input-field {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.input-field .input {
  width: 98%;
  height: 36px;
  border: none;
  border-radius: 18px;
  box-shadow: 0px 8px 15px rgba(2, 61, 255, 0.1);
  outline: none;
  padding-left: 10px;
  padding-right: 35px;
  transition: 0.5s ease-in-out;
  margin: 10px 8px;
}

.input-field .input:focus {
  box-shadow: 0px 2px 8px rgba(13, 227, 255, 0.952);
}

.input-field .input ::placeholder {
  padding-left: 16px;
}

.icon {
  width: 60px;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 30%;
  transform: translateY(-30%);
  height: 36px;
  border: none;
  background-color: transparent;
}

.icon img {
  display: block;
  width: 26px;
  height: 26px;
  line-height: 36px;
  margin: 0 auto;
  transition: all 0.5s ease-in-out;
}

.icon img:hover {
  width: 28px;
  height: 28px;
}

@media screen and (max-width: 760px) {
  .input-field .input {
    margin: 10px 8px 0 8px;
  }
  .chat-box-header .avatar {
    width: 50px;
    height: 50px;
  }
  .chat-box-header h6 {
    font-size: 20px;
  }
  .input-field {
    width: 97%;
  }
}

@media screen and (max-width: 550px) {
  .input-field .input {
    height: 32px;
    border-radius: 14px;
  }
  .chat-box-header .avatar {
    width: 40px;
    height: 40px;
  }
  .chat-box-header h6 {
    font-size: 16px;
  }

  .input-field .input ::placeholder {
    padding-left: 10px;
  }

  .icon {
    width: 40px;
    height: 32px;
  }

  .icon img {
    width: 24px;
    height: 24px;
    line-height: 32px;
  }

  .icon img:hover {
    width: 26px;
    height: 26px;
  }
  .typing {
    font-size: 0.6rem;
    margin-left: 10px;
  }
  .input-field {
    width: 95%;
  }
}
@media screen and (max-width: 350px) {
  .input-field {
    width: 90%;
  }
}
</style>