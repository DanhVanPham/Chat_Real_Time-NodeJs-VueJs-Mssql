<template>
  <div class="message-wrapper">
    <div class="message left" v-if="this.userId !== message.sender">
      <img
        :src="this.currentRoom.roomAvatar"
        width="30"
        height="30"
        alt="user"
      />
      <div class="display">
        <div class="display-name left">
          {{ this.currentRoom.roomName }}
        </div>
        <div class="text-wrapper left">
          {{ this.message.content }}
        </div>
      </div>
    </div>
    <div class="message right" v-else>
      <img :src="this.avatar" width="30" height="30" alt="user" class="image" />
      <div class="display">
        <div class="display-name right">
          {{ this.name }}
        </div>
        <div class="text-wrapper right">
          {{ this.message.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import firebase from "firebase";
export default {
  props: ["message", "currentRoom"],
  data: () => {
    return {
      userId: localStorage.getItem("userId"),
      name: localStorage.getItem("fullName"),
      avatar: localStorage.getItem("avatar"),
    };
  },
  created() {},
};
</script>

<style scoped>
.message-wrapper {
  font-family: "Arsenal", sans-serif;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
  display: block;
}

.message-wrapper .message {
  display: flex;
  flex-direction: row;
  min-height: 40px;
  width: 80%;
  margin-right: 10px;
  margin-bottom: 10px;
}
.message-wrapper .message.right {
  float: right;
  justify-content: flex-end;
  align-items: flex-start;
}

.message-wrapper .message.left {
  justify-content: flex-start;
  align-items: flex-end;
}

.message-wrapper .message.right img {
  border-radius: 50%;
  margin-top: 6px;
  margin-left: 8px;
}

.message-wrapper .message.right .image {
  order: 2;
}

.message-wrapper .message.right .display {
  order: 1;
}

.message-wrapper .message .display {
  display: flex;
  flex-direction: column;
}

.message-wrapper .message.left img {
  border-radius: 50%;
}
.display .display-name.left {
  margin-left: 14px;
  color: #a8a9aa;
}
.display .display-name.right {
  /* display: flex;
  justify-content: flex-end;
  color: #a8a9aa;
  margin-right: 14px; */
  display: none;
}
.text-wrapper {
  padding: 6px;
  padding-left: 12px;
}
.text-wrapper.left {
  background: #63676b;
  border-top-right-radius: 32px;
  border-bottom-right-radius: 32px;
  border-top-left-radius: 32px;
  border-bottom-left-radius: 6px;
  color: white;
  margin-left: 10px;
}
.text-wrapper.right {
  background-color: #0084ff;
  color: white;
  border-top-right-radius: 32px;
  border-bottom-right-radius: 6px;
  border-top-left-radius: 32px;
  border-bottom-left-radius: 32px;
}
@media screen and (max-width: 500px) {
  .message-wrapper .message.right img {
    display: none;
  }
}
@media screen and (max-width: 460px) {
  .message-wrapper {
    margin-top: 8px;
    margin-bottom: 8px;
    margin-left: 8px;
  }

  .message-wrapper .message {
    min-height: 40px;
    width: 70%;
    margin-right: 8px;
    margin-bottom: 8px;
  }

  .display .display-name.left {
    font-size: 12px;
  }
  .text-wrapper {
    padding: 6px;
    padding-left: 10px;
    font-size: 12px;
  }
  .text-wrapper.left {
    background: #63676b;
    border-top-right-radius: 28px;
    border-bottom-right-radius: 28px;
    border-top-left-radius: 28px;
    border-bottom-left-radius: 6px;
  }
  .text-wrapper.right {
    border-top-right-radius: 28px;
    border-bottom-right-radius: 6px;
    border-top-left-radius: 28px;
    border-bottom-left-radius: 28px;
  }
}
</style>