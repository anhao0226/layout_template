<template>
  <div class="wrapper">
    <table id="table">
      <thead class="thead" :style="`left:${-headLeft}px`">
        <tr>
          <td v-for="h in header" :key="h.text">
            <div :class="addClass(h)" :style="addStyle(h)">
              {{ h.label }}
            </div>
          </td>
        </tr>
      </thead>
      <tbody @scroll="handleScroll">
        <tr v-for="(row, index) in tbData" :key="index">
          <td v-for="h in header" :key="h.text">
            <div v-if="h.type === 'index'" :class="addClass(h)">
              {{ index + 1 }}
            </div>

            <!-- default -->
            <div
              class="cell"
              contenteditable
              :style="addStyle(h)"
              v-else-if="h.type === 0"
              @focus="handleFocusEvent(index, row, h.prop)"
              @blur="handleSaveData($event.target.innerText)"
            >
              {{ hasOwn(h, "formatter") ? h.formatter(row) : row[h.prop] }}
            </div>

            <!--  -->
            <el-popover v-else placement="left" :width="400" trigger="click">
              <template #reference>
                <div
                  class="cell"
                  contenteditable
                  @focus="handleFocusEvent(index, row, h.prop)"
                  :style="addStyle(h)"
                >
                  {{ hasOwn(h, "formatter") ? h.formatter(row) : row[h.prop] }}
                </div>
              </template>
              <!--  -->
              <template v-if="h.type === 'select'">
                <el-button @click="handleSelect(1)">男</el-button>
                <el-button @click="handleSelect(2)">女</el-button>
              </template>
              <!--  -->
              <template v-else-if="h.type === 'datePicker'">
                <DatePaicker
                  :defaultValue="row[h.prop]"
                  @change="handleDatePicker"
                ></DatePaicker>
              </template>
            </el-popover>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { userRecords } from "@/api/user.api";
import { Component, defineComponent, onMounted, ref } from "vue";
import { hasOwn } from "@/utils/index";
import { dateFormat } from "@/utils/date";
import { ElDatePicker, ElSelect } from "element-plus";
import DatePaicker from "@/components/datePick.vue";

interface Header {
  type?: number | "index" | "select" | "datePicker";
  prop?: string;
  width?: number;
  formatter?: (row: any) => string;
  label?: string | "index" | "select" | "datePicker";
}

export default defineComponent({
  components: {
    DatePaicker,
  },
  setup() {
    const table = ref({ x: 30, y: 30 });
    const header: Header[] = [
      {
        type: "index",
        label: "#",
      },
      {
        prop: "email",
        width: 180,
        label: "邮箱",
        type: 0,
      },
      {
        type: 0,
        prop: "nickname",
        width: 180,
        label: "昵称",
      },
      {
        type: "select",
        prop: "gender",
        width: 180,
        label: "性别",
        formatter: (row: any): string => {
          return row.gender === 0 ? "未填写" : row.gender === 1 ? "男" : "女";
        },
      },
      {
        type: 0,
        prop: "province",
        width: 180,
        label: "省份",
      },
      {
        type: 0,
        prop: "city",
        width: 180,
        label: "城市",
      },
      {
        type: "datePicker",
        prop: "birthday",
        width: 180,
        label: "生日",
        formatter: (row: any): string => {
          return dateFormat(row["birthday"]);
        },
      },
    ];

    const componentd: Component = [ElDatePicker, ElSelect];

    const tbData = ref([]);
    const headLeft = ref<number>(0);

    const addClass = (h: Header): string => {
      switch (h.type) {
        case "index":
          return "cell tabel-column--index";
        default:
          return "cell";
      }
    };

    const addStyle = (h: Header): string => {
      return `width:${h.width}px`;
    };

    const showBlock = (): boolean => {
      return false;
    };

    onMounted(() => {
      userRecords().then((res) => {
        tbData.value = res;
      });
    });

    const handleScroll = (e: any) => {
      headLeft.value = e.target.scrollLeft;
    };

    let currentObj: any = null!;
    const handleFocusEvent = (index: number, row: any, prop: string) => {
      currentObj = { index, row, prop };
    };

    const handleSaveData = (value: string) => {
      currentObj.row[currentObj.prop] = value;
    };

    const handleDatePicker = (date: Date) => {
      currentObj.row[currentObj.prop] = date;
    };

    //

    const handleSelect = (value: string) => {
      (tbData.value[currentObj.index] as any)[currentObj.prop] = value;
    };

    return {
      table,
      header,
      tbData,
      headLeft,
      hasOwn,
      addClass,
      addStyle,
      handleScroll,
      handleSaveData,
      handleSelect,
      handleDatePicker,
      handleFocusEvent,
    };
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.cell {
  min-width: 100px;
  line-height: 36px;
  color: #606266;
  font-size: 0.85rem;
  outline-color: cornflowerblue;
  text-align: center;
}

.cell-index {
  min-width: 50px !important;
}

.tabel-column--index {
  min-width: 54px !important;
  text-align: center;
}

#table {
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgb(211, 202, 221);
  border-collapse: collapse;
  position: relative;
  width: 100%;
  height: 100%;

  tbody {
    position: absolute;
    z-index: 1002;
    height: calc(100% - 36px);
    margin-top: 37px;
    overflow: scroll;
    width: 100%;
  }

  thead {
    position: absolute;
    z-index: 1003;
    font-weight: 600;
  }

  tr {
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: #ebeef5;
  }

  td {
    border-right-style: solid;
    border-right-color: #ebeef5;
    border-right-width: 1px;
  }
}
</style>