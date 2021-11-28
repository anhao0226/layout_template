<template>
  <div class="wrapper" ref="panel">
    <div class="container">
      <header v-if="defaultHeight[0] > 0">
        <div class="header-box">
          <slot name="header"></slot>
        </div>
      </header>
      <div class="main" v-if="defaultHeight[1] > 0">
        <div class="main-box">
          <slot :info="{ height: defaultHeight[1] }"></slot>
        </div>
      </div>
      <footer v-if="defaultHeight[2] > 0">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  nextTick,
  onMounted,
  ref,
} from "vue";

export default defineComponent({
  props: {
    height: Array,
  },
  setup(props: any) {
    const instance = getCurrentInstance();
    const defaultHeight = ref([50, 0, 50]);

    onMounted(() => {
      nextTick(() => {
        const slotKeys = Object.keys(instance!.slots);
        if (!slotKeys.includes("header")) {
          defaultHeight.value[0] = 0;
        }
        if (!slotKeys.includes("footer")) {
          defaultHeight.value[2] = 0;
        }
        const h = (instance?.refs as any)["panel"].offsetHeight;
        defaultHeight.value[1] =
          h - (defaultHeight.value[0] + defaultHeight.value[2]) - 20;
      });
    });

    return {
      defaultHeight,
    };
    //
  },
});
</script>


<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.container {
   
}

header {
  width: 100%;
  height: 50px;

  .header-box {
    padding: 0 0px 0 14px;
  }
}

.main {
  display: flex;
  margin: auto;
  width: calc(100% - 20px);
  height: calc(100% - 100px);
  background-color: #fff;
  border-radius: 6px;

  .main-box {
    margin: auto;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    // background-color: rebeccapurple;
    border-radius: 4px;
  }
}

footer {
  height: 50px;
  // background-color: darkgoldenrod;
}

:deep(.el-pagination button) {
  background-color: rgba($color: #000000, $alpha: 0);
}

:deep(.el-pager li) {
  background-color: rgba($color: #000000, $alpha: 0);
}
</style> 