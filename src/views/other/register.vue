<template>
  <div class="login-wrapper">
    <div class="container">
      <div class="left">
        <div class="label">
          <span>login</span>
        </div>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          label-position="top"
          label-width="120px"
          class="ruleForm"
        >
          <el-form-item label="Username" prop="pass">
            <el-input
              v-model="ruleForm.pass"
              type="password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="checkPass">
            <el-input
              v-model="ruleForm.checkPass"
              type="password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <div class="item01">
              <span>Remember me</span><span>Forget Password?</span>
            </div>
            <el-button @click="submitForm('ruleForm')">Login</el-button>
            <div class="item02"><span>New User ?</span> Signup</div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { defineComponent } from "@vue/runtime-core";
import { ref } from "vue";

export default defineComponent({
  setup() {
    const ruleForm = ref({
      username: "",
      passwoed: "",
    });

    const router = useRouter();
    const submitForm = () => {
      router.push("/welcome");
    };

    return {
      ruleForm,
      submitForm,
    };
  },
});
</script>

<style lang="scss" scoped>
.login-wrapper {
  height: 100%;
  height: 100%;
  // background-color: #aabcda;
  display: flex;

  .container {
    margin: auto;
    width: 800px;
    height: 470px;
    border-radius: 5px;
    overflow: hidden;
  }
  .left {
    height: 100%;
    width: 43%;
    overflow: hidden;
    display: inline-block;
    // background-color: rgba($color: #fff, $alpha: 0.2);
    border-right: 1px solid rgba($color: #000000, $alpha: 0.03);

    .item02 {
      font-size: 0.78rem;
      span {
        color: grey;
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
      // background-color: seagreen;
    }

    .label {
      // background-color: salmon;
      padding: 34px 26px;
      font-size: 1.8rem;
      font-weight: 600;
    }
  }
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