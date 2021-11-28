<template>
  <div class="container">
    <Panel>
      <e-charts type="line" :data="data" :include="['gender']"></e-charts>
    </Panel>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, SetupContext } from "vue";
import Panel from "@/layout/components/panel.vue";
import { fetchUserRecord } from "@/mock";
import ECharts from "@/components/echarts/line.vue";
import Toolbar from "@/components/toolbar.vue";
import { userRecords } from "@/api/user.api";
import { formatData } from "@/utils";

export default defineComponent({
  name: "user-info",
  components: { Panel, ECharts },
  setup(_, ctx: SetupContext) {
    const data = ref([]);

    onMounted(() => {
      userRecords().then((res) => {
        // res.data.forEach(formatData);
        data.value = res;
        console.log(data.value);
      });
    });

    return {
      data,
    };
  },
});
</script>


<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
}
</style> 