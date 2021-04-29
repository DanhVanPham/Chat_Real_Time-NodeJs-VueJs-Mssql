<template>
  <div class="messages">
    <Message
      v-for="(message, index) in this.chatMessages"
      :message="message"
      :currentRoom="currentRoom"
      :key="index"
    />
  </div>
</template>

<script>
import Message from "../Message/Message.vue";
export default {
  props: ["chatMessages", "currentRoom"],
  components: { Message },
  created: function () {
    // this.chatMessages.sort(function (itemA, itemB) {
    //   return itemA.timeStamp - itemB.timeStamp;
    // });
  },
};
</script>

<style scoped>
.messages {
  box-sizing: border-box;
  overflow: hidden;
}
</style>