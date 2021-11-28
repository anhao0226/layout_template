<template>
  <div class="app-container">
    <div class="navbar">
      <NavBar></NavBar>
    </div>
    <div class="main">
      <div :class="['sidebar']" :style="menuStyle">
        <Sidebar></Sidebar>
      </div>
      <div :class="['content', menuState ? 'sidebar-fold' : '']">
        <div class="tags">
          <tags-layout></tags-layout>
        </div>
        <div class="box"><AppMain></AppMain></div>
        <el-dialog v-model="isFullScreen" :fullscreen="true" width="100%"
          ><AppMain></AppMain
        ></el-dialog>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRef, watch } from "vue";
import NavBar from "./components/navbar/index.vue";
import Sidebar from "./components/sidebar/sidebar.vue";
import AppMain from "./components/main.vue";
import TagsLayout from "@/layout/components/navbar/tags.vue";
import { useAppStore } from "@/store";

export default defineComponent({
  components: {
    AppMain,
    Sidebar,
    NavBar,
    TagsLayout,
  },
  setup() {
    const store = useAppStore();
    const menuState = toRef(store, "menuState");
    const isFullScreen = toRef(store, "isFullScreen");
    const mainState = ref<boolean>(true);
    let timer: any = null;

    const menuStyle = computed(() => {
      return `width:${menuState.value ? "64" : "210"}px`;
    });

    watch(menuState, () => {
      mainState.value = false;
      if (timer) {
        clearTimeout(timer);
      }
      setTimeout(() => {
        mainState.value = true;
      }, 280);
    });

    return {
      store,
      mainState,
      menuState,
      menuStyle,
      isFullScreen,
    };
  },
});
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.navbar {
  width: 100%;
  height: 56px;
  background-color: chocolate;
}

.main {
  display: inline-block;
  width: 100%;
  height: calc(100% - 56px);
  overflow: hidden;
  background-color: #f0f2f5;
  transition: 0.28s;

  .sidebar {
    width: 210px;
    height: 100%;
    display: inline-block;
    overflow: hidden;
    transition: 0.28s;
  }

  .content {
    display: inline-block;
    width: calc(100% - 210px);
    height: 100%;
    overflow: hidden;
    // background-color: aqua;

    .tags {
      height: 50px;
      overflow: hidden;
      line-height: 50px;
      // padding: 0 10px;
    }

    .box {
      height: calc(100% - 50px);
      
    }
  }
}

.sidebar-fold {
  width: calc(100% - 64px) !important;
}
</style>
