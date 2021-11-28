<template>
  <div class="container">
    <!-- export -->
    <export-sheet
      :header="header"
      :data="tbData"
      v-model:visible="exportVisible"
    ></export-sheet>
    <!-- panel -->
    <Panel>
      <template #header>
        <toolbar
          @click="handleMenuClick"
          :showDot="showDot"
          :fields="renderHeader"
        ></toolbar>
      </template>
      <template #default="info">
        <el-table
          style="width: 100%"
          :data="tbData"
          :height="info.info.height"
          v-loading="loading"
          @select="handleSelectionChange"
        >
          <template v-for="item in renderHeader" :key="item.label">
            <el-table-column
              :label="item.label && $t(item.label)"
              :prop="item.prop"
              :min-width="item.width"
              :type="item.type"
              :align="item.align"
              :fixed="item.fixed"
            />
          </template>
        </el-table>
      </template>
      <!-- footer -->
      <template #footer>
        <div class="pagination">
          <el-pagination
            layout="total, sizes, prev, pager, next"
            :total="300"
            :page-sizes="[10, 30, 50]"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </template>
    </Panel>
  </div>
</template>


<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import Panel from "@/layout/components/panel.vue";
import { fetchUserRecord } from "@/mock";
import ExportSheet from "./sheet.vue";
import Toolbar from "@/components/toolbar.vue";
import { ToolbarEvent } from "@/types";
import { userRecords } from "@/api/user.api";
import { valueToLabel } from "@/utils";
import { GenderOptions } from "@/config";

const header = [
  {
    type: "selection",
    fixed: "left",
    align: "center",
    label: "#",
  },
  {
    prop: "email",
    label: "message.email",
    width: 300,
  },
  {
    prop: "nickname",
    label: "message.nickname",
    width: 180,
  },
  {
    prop: "gender",
    label: "message.gender",
    width: 180,
  },
  {
    prop: "province",
    label: "message.province",
    width: 180,
  },
  {
    prop: "city",
    label: "message.city",
    width: 180,
  },
  {
    prop: "birthday",
    label: "message.birthday",
    width: 180,
  },
];

export default defineComponent({
  name: "user-record",
  components: { Panel, Toolbar, ExportSheet },
  setup() {
    const tbData = ref([]);
    const loading = ref<boolean>(false);
    const exportVisible = ref<boolean>(false);
    const renderHeader = ref(header);
    const ruleForm = ref({ name: "", type: "", fileds: [] });
    const showDot = ref<boolean>(false);
    let multipleSelection = [];
    let pageSize = 10;

    onMounted(() => {
      fetchUserData(1, pageSize);
    });

    const handleMenuClick = (type: ToolbarEvent, v: any) => {
      switch (type) {
        case ToolbarEvent.Refresh:
          fetchUserData(1, pageSize);
          break;
        case ToolbarEvent.Fields:
          loading.value = true;
          setTimeout(() => {
            renderHeader.value = header.filter((item: any) => {
              return (v as string[]).includes(item.label);
            });
            loading.value = false;
          }, 300);
          break;
        case ToolbarEvent.Download:
          exportVisible.value = true;
          break;
      }
    };

    const handleSelectionChange = (val: any, row: any) => {
      showDot.value = (val as []).length > 0 ? true : false;
      multipleSelection = val;
    };

    const handleSizeChange = (val: number) => {
      pageSize = val;
    };

    const handleCurrentChange = (val: number) => {
      fetchUserData(val, pageSize);
    };

    const formatData = (item: any) => {
      item.gender = valueToLabel(GenderOptions, item.gender);
    };

    const fetchUserData = (pageNo = 1, pageSize = 10) => {
      loading.value = true;
      userRecords()
        .then((res) => {
          console.log("======================",res);
          res.forEach(formatData);
          tbData.value = res as any;
        })
        .finally(() => {
          loading.value = false;
        });
    };

    return {
      tbData,
      header,
      loading,
      ruleForm,
      showDot,
      exportVisible,
      renderHeader,
      handleSizeChange,
      handleMenuClick,
      handleCurrentChange,
      handleSelectionChange,
    };
  },
});
</script>

<style lang="scss" scoped>
:deep(.el-table-column--selection) {
  padding: 0;
}

:deep(.el-table__header .el-table__cell) {
  // background-color: rgba($color: #000000, $alpha: 0.02);
}

.container {
  height: 100%;
  width: 100%;
  overflow: hidden;

  .dialog-container {
    height: 100%;
  }

  .pagination {
    height: 46px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>