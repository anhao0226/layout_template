<template>
  <div class="login-wrapper">
    <div class="container">
      <div :class="['left', 'anime_translation', state ? '' : 'to_right']">
        <div class="label">
          <span v-if="state">{{ $t("message.login") }}</span>
          <span v-else>{{ $t("message.register") }}</span>
        </div>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          label-position="top"
          label-width="120px"
          class="ruleForm"
        >
          <el-form-item :label="$t('message.username')" prop="pass">
            <el-input v-model="ruleForm.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('message.password')" prop="checkPass">
            <el-input
              v-model="ruleForm.password"
              type="password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <div class="item01" v-if="state">
              <el-checkbox v-model="checked1" label="Remember me"></el-checkbox
              ><span>Forget Password?</span>
            </div>
            <el-button @click="submitForm('ruleForm')">Login</el-button>
            <div class="item02">
              <div v-if="state">
                <span>New User ?</span> <span @click="signUp">Signup</span>
              </div>
              <div v-else>
                <span>Existing Account ?</span>
                <span @click="signUp">Login</span>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div
        :class="['right', 'anime_translation', !state ? '' : 'to_left']"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { defineComponent } from "@vue/runtime-core";
import { ref } from "vue";
import { userRegister, userLogin } from "@/api/user.api";
import Register from "./register.vue";
import { ElMessage, ElNotification } from "element-plus";

export default defineComponent({
  setup() {
    const ruleForm = ref({
      email: "",
      password: "",
    });

    const rules = {};

    const state = ref<boolean>(true);

    const router = useRouter();
    const submitForm = () => {
      if (!state.value) {
        // register
        userRegister(ruleForm.value).then((res) => {
          console.log(res);
          ElMessage({ type: "success", message: "注册成功" });
        });
      } else {
        // login
        userLogin(ruleForm.value).then((res) => {
          ElNotification({
            title: "Success",
            message: "登陆成功",
            type: "success",
          });
          router.push("/welcome");
        });
      }
    };

    const signUp = () => {
      state.value = !state.value;
    };

    return {
      state,
      rules,
      ruleForm,
      signUp,
      submitForm,
    };
  },
});
</script>

<style lang="scss" scoped>
.login-wrapper {
  height: 100%;
  height: 100%;
  display: flex;

  .container {
    margin: auto;
    width: 800px;
    height: 470px;
    border-radius: 5px;
    overflow: hidden;
    position: relative;
    // background-color: rosybrown;
  }
}

.right {
  width: 57%;
  height: 100%;
  background-image: url("./../../assets/login-bg-img.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 90%;
  background-color: #fff;
  position: absolute;
}

.anime_translation {
  -webkit-transition: all 500ms cubic-bezier(0.64, 0.18, 0, 0.905);
  -moz-transition: all 500ms cubic-bezier(0.64, 0.18, 0, 0.905);
  -o-transition: all 500ms cubic-bezier(0.64, 0.18, 0, 0.905);
  transition: all 500ms cubic-bezier(0.64, 0.18, 0, 0.905);
}

.left {
  height: 100%;
  width: 43%;
  overflow: hidden;
  position: absolute;
  background-color: #fff;

  .item02 {
    font-size: 0.78rem;
    span {
      color: grey;
      cursor: pointer;
    }
  }

  .item01 {
    display: flex;
    flex-direction: row;
    font-size: 0.78rem;
    justify-content: space-between;

    span {
      &:last-child {
        color: grey;
      }
    }
  }

  .ruleForm {
    padding: 0 26px;
  }

  .label {
    padding: 34px 26px;
    font-size: 1.8rem;
    font-weight: 600;
  }
}

.to_right {
  transform: translateX(456px);
}

.to_left {
  transform: translateX(344px);
}

:deep(.el-button) {
  background-color: #aabcda;
  font-weight: 600;
  width: 100%;
  border: 1px solid #aabcda;
}

:deep(.el-form-item__label) {
  padding: 3px 0;
  font-weight: 600;
}
</style>