<template>
  <div class="">
    <el-form label-position="top" label-width="100px">
      <template v-for="item in items" :key="item.prop">
        <el-form-item :label="$t(item.label)">
          <template v-if="hasOwn(item, '$type')">
            <!-- select -->
            <el-select
              style="width: 100%"
              v-if="item.$type === 'select'"
              v-model="defaultValue[item.prop]"
            >
              <el-option
                v-for="option in item.$ops"
                :key="option"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
            <!-- datePicker -->
            <el-date-picker
              :placeholder="defaultValue[item.prop]"
              style="width: 100%"
              v-else-if="item.$type === 'date'"
            ></el-date-picker>
          </template>
          <el-input v-else :placeholder="defaultValue[item.prop]"></el-input>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script lang="ts">
import { hasOwn } from "@/utils";
import { defineComponent, ref, toRef, h } from "vue";

export default defineComponent({
  name: "g-form",
  props: ["header", "value"],
  render(){
      return h('div', "12121212")
  },
  setup(props: any) {
    const header = (props.header || []).filter((item: any) =>
      hasOwn(item, "prop")
    );
    const items = ref(header);
    const defaultValue = props.value || {};



    return {
      items,
      defaultValue,
      hasOwn,
    };
  },
});
</script>
