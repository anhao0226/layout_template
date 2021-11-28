<template>
  <section class="app-main">
    <div class="app-container">
      <router-view v-slot="{ Component, route }">
        <transition name="fade02" mode="out-in" appear>
          <keep-alive :include="pageCacheList">
            <component :is="Component" :key="route.fullPath"></component>
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </section>
</template>

<script lang="ts">
import { useAppStore } from "@/store";
import { defineComponent, toRef } from "vue";
export default defineComponent({
  setup() {
    const store = useAppStore();
    const pageCacheList = toRef(store, "pageCacheList");

    return {
      pageCacheList,
    };
  },
});
</script>

<style lang="scss" scoped>
:deep(.el-scrollbar__view) {
  height: 100%;
}

.app-main {
  width: 100%;
  height: 100%;
  display: flex;
  // background-color: aqua;

  .app-container {
    height: calc(100% - 28px);
    margin: auto;
    width: calc(100% - 28px);
    // padding: 10px 0;
    overflow: hidden;
    transition: 0.28s;
    border-radius: 2px;
    // background-color: chartreuse;
  }
}

.fade02-enter-active {
  animation: sta 0.24s;
}
.fade02-leave-active {
  animation: lea 0.24s;
}
@keyframes sta {
  0% {
    opacity: 0;
    transform: translateX(100px);
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}
@keyframes lea {
  0% {
    opacity: 1;
    transform: translateX(0px);
  }
  100% {
    opacity: 0;
    transform: translateX(-100px);
  }
}
</style>