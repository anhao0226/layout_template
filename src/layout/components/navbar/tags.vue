<template>
  <div class="tags-wrapper">
    <div class="tags-show">
      <el-scrollbar>
        <div class="tags-content">
          <i
            :class="['ri-menu-fold-line', 'icon', menuState ? 'menu_fold' : '']"
            @click="handleTagsOp(TagOperation.MenuFold)"
          ></i>
          <template v-for="(item, index) in tagsCache" :key="item.name">
            <span class="tag-box-item" @click="tagToggle(item)">
              <tag
                :closable="item.closable"
                @close="tagClose(item, index)"
                :text="item.meta.title"
                :state="item.state"
              />
            </span>
          </template>
        </div>
      </el-scrollbar>
    </div>
    <!--  -->
    <div class="tags-op">
      <ul>
        <li>
          <i class="ri-refresh-line icon" @click="handleTagsOp(0)"></i>
        </li>
        <li>
          <el-dropdown trigger="click" @command="handleTagsOp">
            <span class="el-dropdown-link">
              <i class="ri-arrow-down-s-line icon"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <template v-for="item in tagOpBtns" :key="item.command">
                  <el-dropdown-item
                    :icon="item.icon"
                    :command="item.command"
                    :disabled="item.disabled"
                    :divided="item.divided"
                    >{{ $t(item.text) }}</el-dropdown-item
                  >
                </template>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>
        <li>
          <i
            class="ri-fullscreen-line icon"
            @click="handleTagsOp(TagOperation.FullScreen)"
          ></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import router from "@/router";
import { storageLocal } from "@/utils";
import { defineComponent, ref, toRef, unref, watch } from "vue";
import { useRoute } from "vue-router";
import Tag from "./tag.vue";
import { TagCache } from "@/types";
import { useAppStore } from "@/store";

enum TagOperation {
  Refresh,
  CloseCurrTag,
  CloseLeftTags,
  CloseRightTags,
  CloseOtherTags,
  CloseAllTags,
  FullScreen,
  MenuFold,
}

export default defineComponent({
  name: "layoutTags",
  components: { Tag },
  setup() {
    const tagOpBtn = [
      {
        icon: "el-icon-refresh-right",
        text: "message.reload",
        command: 0,
        disabled: false,
      },
      {
        icon: "el-icon-remove-outline",
        text: "message.closeCurrentTab",
        command: 1,
        disabled: false,
      },
      {
        icon: "el-icon-back",
        text: "message.closeLeftTabs",
        command: 2,
        disabled: false,
        divided: true,
      },
      {
        icon: "el-icon-right",
        text: "message.closeRightTabs",
        command: 3,
        disabled: false,
      },
      {
        icon: "el-icon-remove",
        text: "message.closeOtherTags",
        command: 4,
        disabled: false,
        divided: true,
      },
      {
        icon: "el-icon-error",
        text: "message.closeAllTags",
        command: 5,
        disabled: false,
      },
    ];

    const fixedTags: TagCache[] = [
      {
        path: "/welcome",
        name: "welcome",
        meta: { title: "message.home", show: true },
        closable: false,
        state: true,
      },
    ];

    const route = useRoute();
    const store = useAppStore();
    let currentTag: TagCache = null!;
    const tagsCache = ref<TagCache[]>([]);
    const tagOpBtns = ref(tagOpBtn);
    const menuState = toRef(store, "menuState");
    const skipRouteName = ["redirect", "login", "register"];

    /**
     * @method watchRouteChange
     */
    const watchRouteChange = () => {
      const { fullPath, name } = unref(route);
      if (skipRouteName.includes(name!.toString())) return;
      let hasTag = false;
      const len = tagsCache.value.length;
      for (let i = 0; i < len; i++) {
        const tag = tagsCache.value[i];
        tag.state = tag.path === fullPath;
        if (tag.state) {
          hasTag = !hasTag;
          currentTag = tag;
          store.menuToggle(currentTag.path);
          handleOpBtnsState(i, len);
        }
      }

      if (!hasTag) {
        const newTag = {
          path: route.path,
          name: route.name as string,
          meta: route.meta as any,
          closable: true,
          state: true,
        };
        currentTag = newTag;
        tagsCache.value.push(newTag);
        handleOpBtnsState(len, len + 1);
      }

      saveTagsCache();
    };

    watch(() => route.path, watchRouteChange);

    /**
     * 处理右侧按钮变化
     * @method handleOpBtnsState
     */
    const handleOpBtnsState = (index: number, tagsLen: number) => {
      let disabledTags: number[] = [];
      if (index === 0) {
        disabledTags = tagsLen === 1 ? [1, 2, 3, 4, 5] : [1, 2];
      } else if (index === tagsLen - 1) {
        disabledTags = tagsLen === 2 ? [2, 3, 4] : [3];
      }
      tagOpBtns.value.forEach((item, index: number) => {
        item.disabled = disabledTags.includes(index);
      });
    };

    /**
     * 处理本地标签缓存
     * @method handleTagsCache
     */
    const handleTagsCache = () => {
      const cache: TagCache[] = storageLocal.getItem("_Tags_cache") || [
        ...fixedTags,
      ];
      const len = cache.length;
      for (let i = 0; i < len; i++) {
        if (cache[i].state) {
          currentTag = cache[i];
          setTimeout(() => {
            store.menuToggle(currentTag.path);
          });
          handleOpBtnsState(i, len);
          break;
        }
      }
      tagsCache.value = cache;
    };

    handleTagsCache();

    /**
     * @method saveTagsCache
     */
    const saveTagsCache = () => {
      storageLocal.setItem("_Tags_cache", tagsCache.value);
    };

    const tagRemove = (func: (tag: TagCache, index: number) => boolean) => {
      tagsCache.value = tagsCache.value.filter(
        (tag: TagCache, index: number) => {
          const removed = func(tag, index);
          !removed &&
            store.pageCacheOperate({ mode: "remove", name: tag.name! });
          return removed;
        }
      );
    };

    /**
     * @method findTag
     * @param key string
     */
    const findTag = (path: string) => {
      let i = 0;
      const len = tagsCache.value.length;
      for (; i < len && tagsCache.value[i].path !== path; i++);
      return i < len ? i : -1;
    };

    /**
     * @method onRefresh
     */
    const onRefresh = () => {
      const { fullPath } = unref(route);
      router.replace({ path: `/redirect${fullPath}` });
    };

    /**
     * @method handleTabsOp
     * @param index number
     */
    const handleTagsOp = (type: TagOperation) => {
      const index = findTag(currentTag?.path);
      switch (type) {
        case TagOperation.FullScreen:
          store.fullScreen();
          break;
        case TagOperation.MenuFold:
          store.menuOpen();
          break;
        case TagOperation.Refresh:
          onRefresh();
          break;
        case TagOperation.CloseCurrTag:
          {
            const seek =
              index < tagsCache.value.length - 1 ? index + 1 : index - 1;
            tagsCache.value[seek].state = true;
            tagToggle(tagsCache.value[seek]);
            route.matched.forEach((item) => {
              store.pageCacheOperate({ mode: "remove", name: item.name! });
            });
            tagsCache.value.splice(index, 1);
          }
          break;
        case TagOperation.CloseLeftTags:
          tagRemove((tag: TagCache, _index: number) => {
            return !tag.closable || _index >= index;
          });
          break;
        case TagOperation.CloseRightTags:
          tagRemove((_: TagCache, _index: number) => {
            return _index <= index;
          });
          break;
        case TagOperation.CloseOtherTags:
          tagRemove((tag: TagCache, _index: number) => {
            return !tag.closable || _index == index;
          });
          break;
        case TagOperation.CloseAllTags:
          tagsCache.value.forEach((item: TagCache) => {
            store.pageCacheOperate({ mode: "remove", name: item.name });
          });
          tagsCache.value = [...fixedTags];
          tagToggle(tagsCache.value[0]);
          break;
      }

      handleOpBtnsState(index, tagsCache.value.length);
      saveTagsCache();
    };

    /**
     * @method tagToggle
     * @param tag TagCache
     * @param index number
     */
    const tagToggle = (tag: TagCache) => {
      tagsCache.value.map((item: TagCache) => {
        item.state = tag.path === item.path;
        return item;
      });
      store.menuToggle(tag.path);
      saveTagsCache();
    };

    /**
     * @method tagClose
     * @param tag TagCache
     * @param index number
     */
    const tagClose = (tag: TagCache, index: number) => {
      if (tag.state) {
        currentTag = tag;
        handleTagsOp(TagOperation.CloseCurrTag);
      } else {
        tagsCache.value.splice(index, 1);
        store.pageCacheOperate({ mode: "remove", name: tag.name! });
        saveTagsCache();
      }
    };

    return {
      store,
      tagsCache,
      tagOpBtns,
      TagOperation,
      menuState,
      tagToggle,
      tagClose,
      tagRemove,
      handleTagsOp,
    };
  },
});
</script>


<style lang="scss" scoped>
.icon {
  padding: 0 9px;
  font-size: 1.12rem;
  color: #666;
  font-size: 600;
  cursor: pointer;
}

.menu_fold {
  transform: rotate(90deg);
}

.tags-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 50px;
  justify-content: space-between;
  background-color: #fff;

  .tags-show {
    padding: 0 4px;
  }

  .tags-content {
    display: flex;
    flex-direction: row;
    align-items: center;

    .tag-box-item {
      padding-right: 4px;
    }
  }

  .el-dropdown-link {
    display: inline-block;
    height: 40px;
    width: 40px;
    line-height: 40px;
  }

  .tags-op {
    // background-color: lightgreen;

    ul {
      display: flex;
      height: 50px;
      flex-direction: row;
      align-items: center;
      list-style: none;
    }

    li {
      display: inline-block;
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background-color: #fff;
      border-radius: 4px;
      margin-left: 4px;

      i {
        color: var(--bs-tag-font-color);
      }
    }
  }
}
</style>
