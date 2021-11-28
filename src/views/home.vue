<template>
  <div id="wrapper">
    <!--  -->
    <el-dialog v-model="dialogVisible" title="信息编辑">
      <el-descriptions direction="vertical" :column="3" title="基本信息">
        <el-descriptions-item width="32%" label="邮箱">
          <el-input
            size="mini"
            style="width: 90%"
            v-model="userinfo.email"
          ></el-input>
        </el-descriptions-item>
        <el-descriptions-item width="32%" label="昵称">
          <el-input
            size="mini"
            style="width: 90%"
            v-model="userinfo.nickname"
            placeholder="Enter value"
          ></el-input>
        </el-descriptions-item>
        <el-descriptions-item width="32%" label="性别">
          <el-select v-model="userinfo.gender" size="mini" placeholder="Select">
            <el-option label="未知" :value="0"></el-option>
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="2"></el-option>
          </el-select>
        </el-descriptions-item>
      </el-descriptions>
      <el-divider></el-divider>
      <el-descriptions direction="vertical" :column="3" title="其他信息">
        <el-descriptions-item width="32%" label="Age">
          <el-input-number
            style="width: 90%"
            size="mini"
            v-model="userinfo.age"
            :min="1"
            :max="100"
          />
        </el-descriptions-item>
        <el-descriptions-item width="32%" label="生日">
          <el-date-picker
            size="mini"
            style="width: 90%"
            v-model="userinfo.birthday"
            type="date"
            placeholder="Pick a day"
          >
          </el-date-picker>
        </el-descriptions-item>
        <el-descriptions-item width="32%" label="注册日期">
          {{ userinfo.created_at }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="mini" @click="dialogVisible = false"
            >Cancel</el-button
          >
          <el-button size="mini" type="primary" @click="submitData"
            >Confirm</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!--  -->
    <div class="container">
      <div class="card__01">
        <div class="card__01__left">
          <el-avatar :size="100" :src="avatar"></el-avatar>
          <el-button style="margin-top: 20px" type="text" @click="openDialog"
            >edit</el-button
          >
          <el-button style="margin-top: 10px" type="text">Success</el-button>
        </div>
        <div class="card__01__right">
          <el-descriptions direction="vertical" :column="3" title="基本信息">
            <el-descriptions-item width="32%" label="邮箱">
              {{ userinfo.email }}
            </el-descriptions-item>
            <el-descriptions-item width="32%" label="昵称">
              {{ userinfo.nickname || "--" }}
            </el-descriptions-item>
            <el-descriptions-item width="32%" label="性别">
              {{
                userinfo.gender
                  ? valueToLabel(GenderOptions, userinfo.gender)
                  : "--"
              }}
            </el-descriptions-item>
          </el-descriptions>

          <el-divider></el-divider>
          <el-descriptions direction="vertical" :column="3" title="其他信息">
            <el-descriptions-item width="32%" label="Age">{{
              userinfo.age || "--"
            }}</el-descriptions-item>
            <el-descriptions-item width="32%" label="生日">{{
              dateFormat(userinfo.birthday, dateTemp) || "--"
            }}</el-descriptions-item>
            <el-descriptions-item width="32%" label="注册日期">
              {{ dateFormat(userinfo.created_at) }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <div class="card__02">
        <!-- ri-cloudy-line -->
        <li>
          <i class="ri-map-pin-line"></i>
          <span>{{ site.province }}</span>
        </li>
        <li>
          <i class="ri-cloudy-line"></i>
          <span>{{ weather.weather }}</span>
        </li>
        <li>
          <i class="ri-temp-cold-line"></i>
          <span>{{ weather.temperature }}</span>
        </li>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { computed, defineComponent, onMounted, ref, toRef, watch } from "vue";
import {
  hasOwn,
  valueToLabel,
  citySearch,
  cityWeather,
  different,
} from "@/utils";
import { GenderOptions } from "@/config";
import { dateFormat, dateTemp } from "@/utils/date";
import { useAppStore } from "@/store";
import { userInfo, userInfoEdit } from "@/api/user.api";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "welcome",
  components: {},
  setup() {
    const weather = ref({
      adcode: "",
      city: "",
      humidity: "",
      info: "",
      province: "",
      reportTime: "",
      temperature: "",
      weather: "",
      windDirection: "",
      windPower: "",
    });

    const userinfo = ref({
      age: 0,
      birthday: "",
      created_at: "",
      email: "",
      gender: 0,
      id: 1,
      nickname: "",
      password: "",
      uid: "",
    });

    const store = useAppStore();
    const avatar = toRef(store, "avatar");
    const dialogVisible = ref<boolean>(false);
    const site = ref({ city: "", province: "" });
    let oldUserInfo: any = null;

    const openDialog = () => {
      dialogVisible.value = true;
      oldUserInfo = Object.assign({}, userinfo.value);
    };

    const submitData = () => {
      const param = different(userinfo.value, oldUserInfo);
      if (Object.keys(param).length > 0) {
        if (hasOwn(param, "birthday")) {
          (param as any)["birthday"] = dateFormat((param as any)["birthday"]);
        }
        userInfoEdit(param as any)
          .then(() => {
            ElMessage({ type: "success", message: "updated success" });
          })
          .finally(() => {
            dialogVisible.value = false;
          });
      }
    };

    onMounted(() => {
      citySearch((v: { province: string; city: string }) => {
        site.value = v;
        cityWeather(v.city, (err, data) => {
          weather.value = err ? {} : data;
          console.log(weather.value);
        });
      });
      userInfo().then((res) => {
        console.log(res);
        userinfo.value = res as any;
      });
    });

    return {
      avatar,
      site,
      weather,
      userinfo,
      dateTemp,
      dialogVisible,
      GenderOptions,
      valueToLabel,
      dateFormat,
      openDialog,
      submitData,
    };
  },
});
</script>

<style lang="scss" scoped>
#wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  // background-color: #fff;
}

.card__01 {
  height: 300px;
  background-color: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
}

.card__01__left {
  width: 240px;
  height: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // background-color: chocolate;
}

.card__01__right {
  list-style: none;
  height: inherit;
  width: calc(100% - 240px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  padding: 0 2%;
}

.card__02 {
  list-style: none;
  margin-top: 10px;

  li {
    width: 200px;
    height: 68px;
    display: inline-block;
    border-radius: 4px;
    background-color: #fff;
    margin-right: 10px;
    text-align: center;
    line-height: 68px;

    i,
    span {
      vertical-align: middle;
      color: var(--bs-tag-font-color);
      font-size: 1.14rem;
    }

    i {
      font-size: 1.4rem;
    }

    span {
      padding: 0 10px;
    }
  }
}

.card {
  display: inline-block;
  background-color: #fff;
  width: 350px;
  overflow: hidden;
  padding: 16px 20px;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
  transition: 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
  }

  .header {
    // background-color: firebrick;
    padding: 6px 0;
  }

  .content {
    // background-color: goldenrod;
    color: #8a8e99;
    padding: 10px 0;
    font-size: 0.8rem;
  }

  .active {
    padding: 6px 0;
    // background-color: rosybrown;

    .item {
      padding-right: 8px;

      span,
      i {
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
      }
      span {
        font-size: 0.85rem;
        padding: 0 6px;
      }
    }
  }
}
</style>
