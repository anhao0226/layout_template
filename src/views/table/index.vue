<template>
  <div class="container">
    <Panel>
      <Table></Table>
    </Panel>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Panel from "@/layout/components/panel.vue";
import Table from "./table.vue";
import DatePaicker from "@/components/datePick.vue";
export default defineComponent({
  components: {
    Panel,
    Table,
    // DatePaicker,
  },
  setup() {
    const handleSelectDate = (date: Date) => {
      console.log(date);
    };

    return {
      handleSelectDate,
    };
  },
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}

.date-picker {
  width: 330px;
  background-color: #fff;
  text-align: center;
  overflow: hidden;
  text-align: center;
  padding: 8px 0;

  .cell {
    padding: 10px;
    color: #606266;
    cursor: pointer;
    font-size: 0.8rem;
    &:hover {
      color: #409eff;
    }
  }

  .cell_select {
    color: #409eff !important;
  }

  table {
    display: inline-block;
    // background-color: coral;
  }

  tbody {
    tr th {
      font-size: 0.8rem;
      font-weight: 500;
      color: #606266;
      padding: 10px;
      border-bottom: 1px solid #dcdfe6;
    }
  }
}
</style>

