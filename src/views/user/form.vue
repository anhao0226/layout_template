<template>
  <el-dialog
    :title="title"
    v-model="visible"
    width="40%"
    @closed="dialogClosed"
  >
    <div class="dialog-content">
      <el-form label-position="top" label-width="100px">
        <template v-for="item in items" :key="item.prop">
          <el-form-item :label="$t(item.label)">
            <template v-if="hasOwn(item, '$type')">
              <!-- select -->
              <g-select
                v-if="item.$type === 'select'"
                v-model="defaultValue[item.prop]"
                :options="item.$ops"
              ></g-select>
              <!-- datePicker -->
              <el-date-picker
                :placeholder="defaultValue[item.prop]"
                style="width: 100%"
                v-else-if="item.$type === 'date'"
              ></el-date-picker>
            </template>
            <el-input
              v-else
              :placeholder="defaultValue[item.prop]"
              v-model="defaultValue[item.prop]"
            ></el-input>
          </el-form-item>
        </template>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { hasOwn } from "@/utils";
import { ElOption, ElSelect } from "element-plus";
import { defineComponent, ref, toRef, h, Component, watch } from "vue";
import { buildSelectComponent } from "./from";

const components: Record<string, Component> = {
  "g-select": buildSelectComponent(),
};

export default defineComponent({
  name: "g-form",
  props: ["modelValue", "header", "value", "title"],
  emits: ["update:modelValue", "submit"],
  components: components,
  setup(props: any, { emit }) {
    const defaultValue = ref(Object.assign({}, props.value || {}));
    const visible = ref(props.modelValue);
    const value = {};

    const header = (props.header || []).filter((item: any) =>
      hasOwn(item, "prop")
    );

    const items = ref(header);

    watch(
      () => props.modelValue,
      (newValue: boolean) => {
        visible.value = newValue;
      }
    );

    const handleSubmit = () => {
      emit("submit", defaultValue);
    };

    const dialogClosed = () => {
      emit("update:modelValue", false);
    };

    return {
      items,
      defaultValue,
      hasOwn,
      handleSubmit,
      visible,
      dialogClosed,
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog-content {
  height: 400px;
}
</style>
