<template>
  <div class="toolbar-wrapper">
    <div class="container">
      <div class="menu-right">
        <template v-for="item in items" :key="item.prop">
          <el-badge v-if="item.badge" :is-dot="showDot" class="badge-item">
            <el-button
              :icon="item.icon"
              :size="item.size || 'small'"
              :type="item.type"
              @click="menuClick(item.prop)"
            >
              {{ $t(item.text) }}
            </el-button>
          </el-badge>
          <div v-else>
            <el-button
              class="badge-item"
              :icon="item.icon"
              :size="item.size || 'small'"
              :type="item.type"
              @click="menuClick(item.prop)"
            >
              {{ $t(item.text) }}
            </el-button>
          </div>
        </template>

        <!--  -->
        <el-dropdown
          :hide-on-click="false"
          style="margin-right: 10px"
          @visible-change="haneleDropdownState"
        >
          <el-button icon="ri-list-settings-line" size="small">
            {{ $t("message.field") }}
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-checkbox-group v-model="checked">
                <el-dropdown-item
                  v-for="field in fieldsList"
                  :key="field.label"
                >
                  <el-checkbox :label="field.label">{{
                    $t(field.label)
                  }}</el-checkbox>
                </el-dropdown-item>
              </el-checkbox-group>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button
          plain
          icon="ri-add-line"
          size="small"
          type="primary"
          @click="menuClick(ToolbarEvent.Add)"
        >
          {{ $t("message.add") }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { hasOwn, isHomeRoute, isInvalidRoute } from "./../utils";
import { ref, defineComponent, onMounted, toRaw, watch } from "vue";
import { ToolbarEvent } from "@/types";
import { RouteRecordRaw, useRoute } from "vue-router";
import homeRouter from "@/router/modules/home";
import { useAppStore } from "@/store";
import { definePropType } from "element-plus/es/utils/props";

interface Item {
  icon: string;
  size: "medium" | "small" | "mini";
  prop: ToolbarEvent;
  text: string;
  type?: string;
  badge?: boolean;
}

const defaultItems: Item[] = [
  {
    icon: "ri-pie-chart-line",
    size: "small",
    prop: ToolbarEvent.Charts,
    text: "message.charts",
  },
  {
    icon: "ri-upload-2-line",
    size: "small",
    prop: ToolbarEvent.Upload,
    text: "message.upload",
  },
  {
    icon: "ri-download-2-line",
    size: "small",
    prop: ToolbarEvent.Download,
    text: "message.download",
    badge: true,
  },
  {
    icon: "ri-delete-bin-line",
    size: "small",
    prop: ToolbarEvent.Delete,
    text: "message.delete",
    badge: true,
  },
  {
    icon: "ri-refresh-line",
    size: "small",
    prop: ToolbarEvent.Refresh,
    text: "message.refresh",
  },
];

export default defineComponent({
  name: "toolbar",
  props: {
    fields: {
      type: Array,
      default: definePropType<[]>([]),
    },
    showDot: Boolean,
  },
  emits: ["click"],
  setup(props: any, { emit }) {
    const items = ref<Item[]>([...defaultItems]);
    const inputValue = ref<string>("");
    const checked = ref<string[]>([]);
    let fieldsList: Item[] = Object.assign(toRaw(props.fields || []));
    let prevCheckedLength = fieldsList.length;
    const breadcrumbList = ref<RouteRecordRaw[]>([]);

    fieldsList = fieldsList.filter((item: any) => {
      const hasLabel = hasOwn(item, "label") && item.label;
      hasLabel && checked.value.push(item.label);
      return hasLabel;
    });

    const haneleDropdownState = (state: boolean) => {
      const length = checked.value.length;
      if (length != prevCheckedLength) {
        emit("click", ToolbarEvent.Fields, checked.value);
        prevCheckedLength = length;
      }
    };

    const menuClick = (op: ToolbarEvent) => {
      emit("click", op, null);
    };

    return {
      inputValue,
      items,
      checked,
      fieldsList,
      breadcrumbList,
      ToolbarEvent,
      menuClick,
      haneleDropdownState,
    };
  },
});
</script>


<style lang="scss"  scoped>
:deep(.el-button--small) {
  padding: 4px 10px;
  border: none;

  i {
    font-size: 0.84rem;
    vertical-align: middle;
  }

  span {
    vertical-align: middle;
    padding-left: 6px;
  }
}

:deep(.el-input__prefix) {
  padding-left: 6px;
}

:deep(.el-breadcrumb__item) {
  height: 49px;
  line-height: 49px;
  display: flex;
  flex-direction: row;
  align-items: center;

  &:last-child span {
    color: #97a8be !important;
  }
  span {
    font-size: 0.8rem;
    color: var(--bs-breadcrumb-color);
  }
  .el-breadcrumb__separator {
    font-size: 0.6rem;
  }
}

.toolbar-wrapper {
  width: 100%;
  height: 100%;

  .container {
    height: inherit;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .menu-right {
    // background-color: lemonchiffon;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .badge-item {
    margin-right: 10px;
  }
}
</style>