<template>
  <el-dialog
    v-model="dialogVisible"
    width="500px"
    title="导出"
    :before-close="closeDialog"
  >
    <template #default>
      <div class="dialog-container">
        <el-scrollbar>
          <el-form :model="ruleForm" label-width="120px">
            <!-- filename -->
            <el-form-item label="文件名称">
              <el-input
                v-model="ruleForm.name"
                style="width: 240px"
                size="medium"
                placeholder="导出文件名称"
              ></el-input>
            </el-form-item>
            <!-- export date -->
            <el-form-item label="数据类型">
              <el-select
                size="medium"
                style="width: 240px"
                v-model="ruleForm.type"
                placeholder="导出数据类型"
              >
                <el-option label="选着数据" :value="0"></el-option>
                <el-option label="所有数据" :value="1"></el-option>
                <el-option label="当前数据" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <!-- export field -->
            <el-form-item label="导出字段">
              <div class="export-field-box">
                <div class="item01">
                  <el-checkbox label="全部" @change="allFieldsToggle" checked />
                </div>
                <div class="item02">
                  <el-scrollbar>
                    <el-checkbox-group v-model="exportFields">
                      <ul>
                        <template
                          v-for="(item, index) in renderFields"
                          :key="item.label"
                        >
                          <li>
                            <el-checkbox :label="index">{{
                              $t(item.label)
                            }}</el-checkbox>
                          </li>
                        </template>
                      </ul>
                    </el-checkbox-group>
                  </el-scrollbar>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </template>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="exportVisible = false">取消</el-button>
        <el-button type="primary" @click="exportExeclSheet">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>


<script lang="ts">
import { defineComponent, ref, toRef, watch } from "vue";
import { hasOwn, jsonToSheet } from "@/utils";
import i18n from "vue-i18n";
import { userHeader } from "@/plugins/i18n/index";

interface TagType {
  prop: string;
  label: string;
}

export default defineComponent({
  name: "sheet",
  props: {
    data: Object,
    header: Object,
    visible: Boolean,
  },
  emits: ["update:visible"],
  setup(props: any, { emit }) {
    const renderFields: TagType[] = [];
    const exportFields = ref<number[]>([]);
    const dialogVisible = ref<boolean>(props.visible);
    const ruleForm = ref({ name: "", type: "", fileds: [] });

    props.header.forEach((item: TagType) => {
      if (hasOwn(item, "label") && item.label) {
        renderFields.push(item);
        exportFields.value.push(renderFields.length - 1);
      }
    });

    watch(
      () => props.visible,
      (state: boolean) => {
        dialogVisible.value = state;
      }
    );

    const closeDialog = () => {
      emit("update:visible", false);
    };

    const exportExeclSheet = () => {
      const header = [];
      for (const index of exportFields.value) {
        const item = renderFields[index];
        item.label = (userHeader.zh as any)[item.label.split(".")[1]];
        header.push(renderFields[index]);
      }
      const { name } = ruleForm.value;
      jsonToSheet(name, header, props.data);
    };

    const allFieldsToggle = (state: boolean) => {
      //   exportFields.value = state ? renderFields : [];
    };

    return {
      ruleForm,
      dialogVisible,
      renderFields,
      exportFields,
      closeDialog,
      allFieldsToggle,
      exportExeclSheet,
    };
  },
});
</script>

<style lang="scss">
.el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .el-dialog__body {
    flex: 1;
    overflow: auto;
  }
}

.export-field-box {
  width: 240px;
  height: 200px;
  border: 1px solid #eee;
  overflow: hidden;
  border-radius: 4px;

  .item01 {
    height: 50px;
    background-color: #eee;
    padding: 0 10px;
    line-height: 50px;
  }

  .item02 {
    height: 150px;
    padding: 0 10px;
  }
}
</style>