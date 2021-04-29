<template>
  <div class="tags-input-container">
    <div
      class="tag"
      v-for="(tag, index) in this.cartDetails"
      :key="'tag' + index"
    >
      <span class="content__tag">{{ tag.fullName }}</span>
      <span @click="removeTag(tag)" v-if="tag.userId !== userIdSelf">
        <i class="fa fa-times"></i
      ></span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Vue from "vue";
export default {
  data: () => ({
    tags: [],
    userIdSelf: localStorage.getItem("userId"),
  }),
  computed: {
    ...mapGetters("cart", ["cartDetails"]),
  },
  methods: {
    async removeTag(tag) {
      if (tag) {
        let response = await this.deleteCartDetailByCartDetailId(
          tag.cartDetailId
        );
        if (response === 200) {
          Vue.toasted.show("Delete cart detail successfully").goAway(1500);
        } else {
          Vue.toasted.show("Delete cart detail failed!").goAway(1500);
        }
      }
    },
    ...mapActions("cart", ["deleteCartDetailByCartDetailId"]),
  },
  created() {},
};
</script>

<style>
.tags-input-container {
  width: 100%;
  padding: 10px;
  background-color: rgba(#fff, 0.7);
  overflow-y: scroll;
  min-height: fit-content;
  max-height: 100px;
}

.tags-input-container::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
}
.tags-input-container::-webkit-scrollbar {
  width: 4px;
  background-color: #f5f5f5;
}

.tags-input-container::-webkit-scrollbar-thumb {
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

.tag {
  float: left;
  padding: 3px 5px;
  display: flex;
  justify-content: center;
  cursor: pointer;
  max-width: 45%;
}

.content__tag {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tag:hover {
  background-color: #57c340;
  border-radius: 5px;
}

span:first-child {
  margin-right: 8px;
}
</style>