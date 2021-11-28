<template>
  <div class="wrapper">
    <div class="container">
      <div class="vertical-hedaer">
        <div class="vertical-hedaer-left">
          <div class="details">
            <i class="ri-heart-2-fill"></i>
            <span>Health & Medical</span>
          </div>

          <div class="input-wrapper" style="width: 100px">
            <i class="ri-search-line"></i>
            <span><input type="text" placeholder="Enter search value" /></span>
          </div>
        </div>
        <!--  -->
        <div class="vertical-hedaer-right">
          <!--  -->
          <el-dropdown trigger="click" @command="languageToggle">
            <span class="icon">
              <i class="ri-translate-2"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="zh">简体中文</el-dropdown-item>
                <el-dropdown-item command="en">English</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <!--  -->
          <el-dropdown trigger="click" @command="handleSetting">
            <span class="el-dropdown-link">
              <i class="ri-settings-line icon_anim_rotate icon"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item icon="ri-logout-box-r-line" :command="0">
                  logout
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <span class="userinfo">
            <el-avatar size="small" :src="avatar"></el-avatar>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import router from "@/router";
import homeRouter from "@/router/modules/home";
import { useAppStore } from "@/store";
import { isHomeRoute, isInvalidRoute, storageLocal } from "@/utils";
import { computed, defineComponent, onMounted, ref, toRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { RouteRecordRaw, useRoute } from "vue-router";

export default defineComponent({
  setup() {
    const route = useRoute();
    const store = useAppStore();
    const { locale } = useI18n();
    const avatar = toRef(store, "avatar");
    const menuState = toRef(store, "menuState");
    const breadcrumbList = ref<RouteRecordRaw[]>([]);

    onMounted(() => {
      const language = storageLocal.getItem("language");
      locale.value = language ? language.local : "zh";
    });

    const closeMenu = () => {
      store.menuOpen();
    };

    const languageToggle = (type: string) => {
      locale.value = type;
      storageLocal.setItem("language", { local: type });
    };

    const handleSetting = (command: number) => {
      switch (command) {
        case 0:
          router.push("/login");
          break;
      }
    };

    return {
      avatar,
      menuState,
      breadcrumbList,
      closeMenu,
      languageToggle,
      handleSetting,
    };
  },
});
</script>

<style lang="scss" scoped>
$base-height: 56px;

.input-wrapper {
  position: relative;
  min-width: 240px;
  height: 34px;
  margin-left: 10px;

  i {
    position: absolute;
    display: inline-block;
    width: 34px;
    line-height: 34px;
    text-align: center;
    color: var(--bs-font-color);
    font-size: 1.18rem;
    color: #f8f8f8;
  }

  span {
    height: 34px;
    width: calc(100% - 34px);
    margin-left: 34px;
    display: inline-block;
  }

  input {

    &::placeholder {
      color: #f8f8f8;
    }

    border-style: none;
    outline: none;
    height: 100%;
    width: 100%;
    font-size: 1rem;
    // color: var(--bs-font-color);
    color: #f8f8f8 !important;
    background-color: #409EFF;
  }
}

.wrapper {
  width: 100%;
  height: 56px;
  overflow: hidden;
  background-color: #409EFF;
  border-bottom: 1px solid #f8f8f8;

  .container {
    padding: 0 10px;
  }

  .el-breadcrumb {
    height: $base-height;
    line-height: $base-height;
    font-size: 0.9rem;
  }
}

.vertical-hedaer {
  width: 100%;
  height: $base-height;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: var(--bs-background-color);
  background-color: #409EFF;

  .vertical-hedaer-left,
  .vertical-hedaer-right {
    display: flex;
    flex-direction: row;
    height: $base-height;
    align-items: center;

    .details {
      width: 210px;
      i,
      span {
        display: inline-block;
        vertical-align: middle;
      
      }

      i {
        padding-left: 14px;
        font-size: 1.2rem;
      }

      span {
        padding-left: 10px;
        color: #f8f8f8;
      }
    }
  }

  .vertical-hedaer-right {
    padding: 0 10px;
  }
}

.icon {
  height: $base-height;
  line-height: $base-height;
  display: inline-block;
  text-align: center;
  font-size: 1.18rem;
  color: var(--bs-breadcrumb-color);
  color: #f8f8f8;
  cursor: pointer;
  transition: 0.3s;
  padding: 0 8px;
}

.icon_anim_rotate {
  &:hover {
    transform: rotate(90deg);
  }
}

.menu_fold {
  transform: rotate(90deg);
}

.userinfo {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 12px;

  .name {
    font-size: 0.82rem;
    padding: 0 10px;
    font-weight: 600;
    color: var(--bs-font-color);
  }
}

.list-enter-active,
.list-leave-active {
  opacity: 0;
  transition: all 0.28s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

/**
 const style = [
      {
        "--bs-color": "rgba(0, 0, 0, 0.2)",
        "--bs-background-color": "#606266",
        "--bs-tag-font-color": "rgba(255, 255, 255, 0.7)", // tag #666
        "--bs-font-color": "rgba(255, 255, 255, 0.7)",
        "--bs-icon-color": "rgba(255, 255, 255, 0.7)", // #303133
        "--bs-border-color": "#909399", // #dcdfe6
        "--bs-menu-hover-background-color":
          "rgba(255, 255, 255, 0.6) !important",
        "--bs-breadcrumb-color": "",
      },
    ];

    const modeToggle = () => {
      const rootElement = document.documentElement;
      const dark = style[0];
      Object.keys(dark).forEach((item: string) => {
        rootElement.style.setProperty(item, `var(${item}--dark)`);
      });
      store.colorStyleToggle();
    };

*/