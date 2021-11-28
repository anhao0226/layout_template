<template>
  <div :class="['tag-wrapper', state ? 'select' : 'hover']">
    <div class="container">
      <span>{{ $t(text) }}</span>
      <i
        v-if="closable"
        class="el-icon-close"
        @click.prevent.stop="emit('close', true)"
      ></i>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "tag",
  props: {
    closable: Boolean,
    text: String,
    state: Boolean,
  },
  emits: ["close", "update:modelValue"],
  setup(_, { emit }) {
    return {
      emit,
    };
  },
});
</script>

<style lang="scss" scoped>
$base-color: #409eff;

.tag-wrapper {
  cursor: pointer;
  position: relative;
  transition: 0.2s;
  border-radius: 2px;
  background-color: #fff;

  .container {
    font-size: 0.85rem;
    height: 30px;
    padding: 0 6px;
    line-height: 30px;

    span {
      color: var(--bs-tag-font-color);
      padding: 0 4px;
    }

    i {
      padding: 2px 2px;
      transition: 0.4s;
      color: $base-color;
      font-size: 0.7rem;
      display: none;
      transition: 0.28s;

      &:hover {
        background-color: #eee;
        border-radius: 50%;
      }
    }
  }

  // &::before {
  //   position: absolute;
  //   content: "";
  //   height: 2px;
  //   width: 0;
  //   background-color: $base-color;
  //   bottom: 0;
  //   transition: 0.3s;
  //   border-radius: 1px;
  // }
}

.hover {
  &:hover::before {
    width: 100%;
  }

  &:hover .container i {
    display: inline-block;
  }
}

.select {
  background-color: rgba($base-color, 0.1);
  color: $base-color;

  .container {
    span {
      color: $base-color;
    }

    i {
      display: inline-block;
    }
  }

  &::before {
    width: 100%;
  }
}
</style>
