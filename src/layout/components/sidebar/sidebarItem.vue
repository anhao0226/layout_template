<template>
  <template v-if="hasOneShowingChild(item)">
    <el-menu-item :index="resolvePath(basePath, showChild.path)">
      <i :class="['icon', showChild.meta.icon || 'el-icon-right']"></i>
      <span>{{ $t(showChild.meta.title) }} </span>
    </el-menu-item>
  </template>
  <el-sub-menu
    v-else
    :index="basePath"
    :class="[currentMenu.indexOf(basePath) > -1 ? 'el-sub-menu__select' : '']"
  >
    <template #title>
      <i v-if="hasOwn(item.meta, 'icon')" :class="['icon', item.meta.icon]"></i>
      <span>{{ $t(item.meta.title) }}</span>
    </template>
    <template v-for="(child, index) in item.children" :key="index">
      <sidebar-item
        :item="child"
        :basePath="resolvePath(item.path, child.path)"
      ></sidebar-item>
    </template>
  </el-sub-menu>
</template>

<script lang="ts">
import path from "path";
import { defineComponent, ref, toRef } from "vue";
import { hasOwn } from "@/utils";
import { ElMenuItem, ElSubMenu } from "element-plus";
import { useAppStore } from "@/store";

export default defineComponent({
  name: "SidebarItem",
  props: ["item", "basePath", "active"],
  components: {
    ElMenuItem,
    ElSubMenu,
  },
  setup(props: any) {
    const store = useAppStore();
    const showChild = ref(null);
    const currentMenu = toRef(store, "currentMenu");

    const resolvePath = (base: string, _path: string): string => {
      console.log(base, _path);
      return path.resolve(base, _path);
    };

    const hasOneShowingChild = (v: any): boolean => {
      const children: any[] = v.children || [];
      if (children.length === 1) {
        showChild.value = children[0];
        return true;
      }

      if (children.length === 0) {
        showChild.value = { ...props.item, path: "" };
        return true;
      }

      return false;
    };

    return {
      showChild,
      currentMenu,
      hasOwn,
      resolvePath,
      hasOneShowingChild,
    };
  },
});
</script>

<style lang="scss" scoped>
.el-sub-menu__select {
  .el-sub-menu__title {
    span,
    i {
      color: var(--bs-sidebar-select-color) !important;
    }
  }
}

.icon {
  font-size: 1.2rem;
  margin-right: 6px;
  font-weight: 500;
}

.el-sub-menu::after {
  display: none !important;
}

.is-active {
  color: #409eff !important;
  position: relative;
  &::after {
    content: "";
    width: 2px;
    height: 100%;
    background-color: #409eff;
    display: block;
    right: 0;
    position: absolute;
    top: 0;
  }
}
</style>
