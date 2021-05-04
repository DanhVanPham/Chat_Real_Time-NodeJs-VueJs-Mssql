<template>
  <div class="form-container">
    <form class="form">
      <h1 class="title">Profile Account</h1>
      <div class="show-image">
        <img :src="this.avatar" alt="image-user" />
      </div>
      <InputField
        :type="`text`"
        :name="`input name`"
        :label="`Name`"
        :placeHolder="`Name`"
        :value="fullName"
        @input="fullName = $event"
      />
      <div class="input-container">
        <div class="input-icon"><i class="fa fa-picture-o"></i></div>
        <div class="input-field">
          <h5>Image</h5>
          <input
            type="file"
            placeholder="Image"
            name="input gmail"
            class="input gmail"
            @change="changeAvatar"
          />
        </div>
      </div>
      <button
        type="submit"
        class="button-login btn-save"
        @click.prevent="uploadAvatar()"
      >
        Save change
      </button>
      <div style="margin-top: 25px" class="pagination" />
      <p class="link-create">Back to chat: <a :href="`/users`">Go back</a></p>
    </form>
  </div>
</template>

<script>
import InputField from "../components/InputField/InputField.vue";
import firebase from "../services/firebase.js";
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
export default {
  components: { InputField },
  data: () => {
    return {
      avatar: "",
      fullName: "",
      userId: "",
      newPhoto: "",
    };
  },
  computed: {
    ...mapGetters("user", ["user"]),
  },
  methods: {
    changeAvatar(event) {
      if (event.target.files && event.target.files[0]) {
        const fileType = event.target.files[0].type.toString();
        if (fileType.indexOf("image") != 0) {
          Vue.toasted.show("Please choose an image").goAway(1500);
          return;
        }
        this.newPhoto = event.target.files[0];
        this.avatar = URL.createObjectURL(event.target.files[0]);
      } else {
        Vue.toasted.show("Something went wrong!").goAway(1500);
      }
    },
    uploadAvatar() {
      if (this.newPhoto) {
        const upload = firebase
          .storage()
          .ref()
          .child(this.userId)
          .put(this.newPhoto);
        // we need download url
        upload.on(
          "state_changed",
          null,
          (err) => {
            console.log("error", err.message);
          },
          () => {
            upload.snapshot.ref.getDownloadURL().then((url) => {
              this.updateUserInfo(true, url);
            });
          }
        );
      } else {
        // if user only wants to update his/her name and desc
        this.updateUserInfo(false, null);
      }
    },
    async updateUserInfo(isUrlPresent, downloadURL) {
      let newInfo = {};
      if (isUrlPresent) {
        newInfo = {
          userId: this.user.userId,
          fullName: this.fullName,
          avatar: downloadURL,
        };
      } else {
        newInfo = {
          userId: this.user.userId,
          fullName: this.fullName,
          avatar: this.avatar,
        };
      }
      let response = await this.editProfileExist(newInfo);
      if (response === 200) {
        Vue.toasted.show("Edit profile successfully.").goAway(1500);
        this.$router.push("/users");
      } else {
        Vue.toasted.show("Edit profile failed!").goAway(1500);
      }
    },
    ...mapActions("user", ["editProfileExist"]),
  },
  created() {
    this.avatar = this.user.avatar;
    this.fullName = this.user.fullName;
    this.userId = this.user.userId;
  },
};
</script>

<style scoped>
.form-container .form {
  background: rgb(252, 251, 251);
  padding: 20px 50px;
  border-radius: 25px;
  width: 400px;
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -30%);
}
.form-container .form .title {
  text-align: center;
  font-family: "Arsenal", sans-serif;
  font-weight: 500;
  font-size: 2rem;
  color: #6c63ff;
  padding: 1rem 0;
}
.form-container .form .show-image {
  width: 150px;
  height: 150px;
  display: block;
  margin: 0 auto;
  border: none;
}
.form-container .form .show-image img {
  width: 150px;
  height: 150px;
  position: relative;
  padding: 10px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.btn-save {
  display: block;
  width: 50%;
  height: 34px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  background: #6c63ff;
  color: white;
  border: none;
  border-radius: 45px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.22);
  cursor: pointer;
  outline: none;
  margin: 0 auto;
}
.pagination {
  height: 1px;
  width: 100%;
  background-color: rgb(187, 179, 179);
}
p.link-create {
  padding: 10px 10px;
  text-align: center;
  font-family: "Arsenal", sans-serif;
  font-size: 0.9rem;
}
p.link-create a {
  text-decoration: none;
  color: #6c63ff;
}

p.link-create a:hover {
  border-bottom: 1px solid black;
}

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
  height: 40px;
  border: none;
  border-radius: 18px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  outline: none;
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
.input.gmail {
  padding: 8px 10px;
}
@media screen and (max-width: 760px) {
  .form-container .form {
    height: 100vh;
    width: 100vw;
    border-radius: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .input-field h5 {
    margin-top: 0px;
    font-size: 17px;
  }
  .input-field .input {
    height: 30px;
    margin-bottom: 8px;
  }
  .input.gmail {
    padding: 4px 10px;
  }
}
@media screen and (max-width: 435px) {
  .form-container .form .title {
    font-weight: 400;
    font-size: 1.6rem;
    padding: 0.6rem 0;
  }
  .form-container .form .show-image {
    width: 120px;
    height: 120px;
  }
  .form-container .form .show-image img {
    width: 120px;
    height: 120px;
  }
  .btn-save {
    height: 30px;
    font-size: 8px;
    letter-spacing: 2px;
    border-radius: 32px;
  }

  .input.gmail {
    padding: 5px 10px;
  }
}
</style>