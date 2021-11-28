<template>
  <div class="container">
    <div class="menu-list">
      <el-scrollbar>
        <el-menu
          unique-opened
          :default-active="currentMenu"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          @select="menuSelect"
        >
          <template v-for="(child, index) in routes" :key="index">
            <sidebar-item
              v-if="child.meta.show"
              :item="child"
              :basePath="child.path"
            ></sidebar-item>
          </template>
        </el-menu>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRef } from "vue";
import { useRoute } from "vue-router";
import SidebarItem from "./sidebarItem.vue";
import { useAppStore } from "@/store";

export default defineComponent({
  components: {
    SidebarItem,
  },
  setup() {
    const route = useRoute();
    const store = useAppStore();
    const isCollapse = toRef(store, "menuState");
    const currentMenu = toRef(store, "currentMenu");
    const routes = toRef(store, "routes");
    store.initRouter();

    const menuSelect = (path: string) => {
      store.menuToggle(path);
    };

    return {
      route,
      routes,
      currentMenu,
      isCollapse,
      menuSelect,
    };
  },
});
</script>

<style lang="scss" scoped>
:deep(.el-menu) {
  border-right: none;
  transition-property: height;
  transition: var(--bs-transition);
  background-color: inherit;
  color: var(--bs-font-color);
}

:deep(.el-sub-menu) {
  .el-menu-item {
    font-size: 0.74rem !important;

    .el-icon-right {
      font-size: 0.72rem;
      font-weight: 600;
    }
  }
}

:deep(.el-menu-item) {
  font-size: 0.84rem;
  color: var(--bs-font-color);
  transition: var(--bs-transition);
  letter-spacing: 0.5px;

  &:hover {
    background-color: var(--bs-menu-hover-background-color);
  }

  i {
    font-weight: 600;
  }
}

:deep(.el-sub-menu__title) {
  color: var(--bs-font-color);
  font-size: 0.84rem;
  &:hover {
    background-color: var(--bs-menu-hover-background-color);
  }

  i {
    font-weight: 600;
  }
}

.container {
  width: 100%;
  height: 100%;
  background-color: var(--bs-background-color);
}

.header {
  height: 47px;
  line-height: 47px;
  font-size: 1.1rem;
  text-align: center;
  overflow: hidden;
  // border-right: 1px solid var(--bs-border-color);

  img {
    width: 40px;
    height: 40px;
    display: inline-block;
    vertical-align: middle;
  }

  span {
    padding: 0 10px;
    font-weight: 600;
    display: inline-block;
    vertical-align: middle;
    color: #409eff;
    transition: var(--bs-transition);
  }
}

.menu-list {
  height: calc(100% - 48px);
  // border-right: 1px solid var(--bs-border-color);
}
</style>
