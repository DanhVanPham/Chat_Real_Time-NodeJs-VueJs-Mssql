<template>
  <div class="input-container">
    <div class="input-icon"><i :class="this.icon"></i></div>
    <div class="input-field">
      <h5>{{ this.label }}</h5>
      <input
        :type="this.type"
        :placeholder="this.placeHolder"
        :name="this.label"
        :class="this.name"
        v-model="inputVal"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ["icon", "type", "name", "label", "placeHolder", "value"],
  data: () => {
    return {
      username: "",
      password: "",
    };
  },
  computed: {
    inputVal: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
};
</script>

<style scoped>
.input-container {
  position: relative;
  display: grid;
  grid-auto-columns: 7% 93%;
  margin: 25px 0;
  padding: 5px 0;
  border-bottom: 2px solid #e4e1e1;
}
.input-icon {
  grid-column: 1;
  justify-content: center;
  align-items: center;
}
.input-field {
  position: relative;
  grid-column: 2;
}
.input-field h5 {
  margin-top: 1px;
  font-family: "Arsenal", sans-serif;
}
.input-field .input {
  width: 88%;
  height: 36px;
  border: none;
  border-radius: 18px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  outline: none;
  padding-left: 10px;
  transition: 0.5s ease-in-out;
  margin-bottom: 10px;
}
.input-field .input:focus {
  width: 92%;
  box-shadow: 0px 2px 8px rgba(13, 227, 255, 0.952);
}
.input-field .input ::placeholder {
  padding-left: 16px;
}
@media screen and (max-width: 750px) {
  .input-field h5 {
    margin-top: 0px;
    font-size: 17px;
  }
  .input-field .input {
    height: 30px;
    margin-bottom: 8px;
  }
}

@media screen and (max-width: 450px) {
}
</style>