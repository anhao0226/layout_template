<template>
  <div class="container">
    <div class="date-picker">
      <div class="toolbar">
        <span class="op-btn" @click="handleBtnClick('year', false)">
          <i class="ri-arrow-left-s-fill"></i>
        </span>
        <span class="op-btn" @click="handleBtnClick('month', false)">
          <i class="ri-arrow-left-s-line"></i>
        </span>
        <span class="details">
          <span>{{ year }}</span>
          <span>年</span>
          <span>{{ fillZero(month) }}</span>
          <span>月</span>
        </span>
        <span class="op-btn" @click="handleBtnClick('month', true)">
          <i class="ri-arrow-right-s-line"></i>
        </span>
        <span class="op-btn" @click="handleBtnClick('year', true)">
          <i class="ri-arrow-right-s-fill"></i>
        </span>
      </div>
      <table cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
          <tr v-for="y in [0, 1, 2, 3, 4, 5]" :key="-y">
            <td
              v-for="x in [0, 1, 2, 3, 4, 5, 6]"
              @click="handleCellClick(y * 7 + x)"
              :key="y * 7 + x"
            >
              <div
                :class="[
                  'cell',
                  currSelectIndex === format(y * 7 + x) ? 'cell_select' : '',
                  addDisabledStyle(y * 7 + x),
                  addCurrentStyle(y * 7 + x),
                ]"
              >
                <span>
                  {{ render[y * 7 + x] }}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import dayjs, { Dayjs } from "dayjs";
export default defineComponent({
  props: ["defaultValue"],
  emits: ["change"],
  setup(props: any, { emit }) {
    let week = 0;
    let currDay = 0;
    let daysCount = 0;
    let currDayStr = "";
    let dateInstance: Dayjs | null = null;

    const cellCount = 42;
    const year = ref<number>(0);
    const month = ref<number>(0);
    const render = new Array(cellCount);
    const currSelectIndex = ref<string>("");

    const daysInMonth = (year: number, month: number): number => {
      const date = new Date(year, month, 0);
      return date.getDate();
    };

    const fistDayWeek = (year: number, month: number) => {
      const date = new Date(year, month - 1, 1);
      return date.getDay();
    };

    const addDisabledStyle = (index: number): string => {
      return index < week || index >= daysCount + week ? "cell_disabled" : "";
    };

    const format = (day: number) => {
      return `${year.value}${fillZero(month.value)}${fillZero(day)}`;
    };

    const addCurrentStyle = (index: number): string => {
      if (index >= week && index <= daysCount + week) {
        return format(render[index]) === currDayStr ? "cell_current" : "";
      }
      return "";
    };

    const fillZero = (v: number): string => {
      return v < 10 ? "0" + v : "" + v;
    };

    const init = (v: Date) => {
      dateInstance = dayjs(v);
      currDay = dateInstance.date();
      daysCount = dateInstance.daysInMonth();
      const _year = dateInstance.year();
      const _month = dateInstance.month() + 1;
      week = fistDayWeek(_year, _month);
      const prevDayCount = daysInMonth(_year, _month - 1);
      year.value = _year;
      month.value = _month;
      return { prevDayCount };
    };

    const updateData = (args: { week: number; prevDayCount: number }) => {
      for (let i = 0; i < args.week; i++) {
        render[args.week - i - 1] = args.prevDayCount--;
      }

      for (let i = 0; i < daysCount; i++) {
        render[args.week + i] = i + 1;
      }

      let index = 0;
      for (let i = args.week + daysCount; i < 42; i++) {
        render[i] = ++index;
      }
    };

    console.log(props.defaultValue);
    if (props.defaultValue) {
      let { prevDayCount } = init(props.defaultValue);
      updateData({ week, prevDayCount });
    } else {
      let { prevDayCount } = init(new Date());
      updateData({ week, prevDayCount });
    }

    currDayStr = format(currDay);

    const handleCellClick = (num: number) => {
      if (format(num) !== currSelectIndex.value) {
        currSelectIndex.value = format(num);
        emit("change", new Date(year.value, month.value - 1, render[num]));
      }
    };

    const handleBtnClick = (type: "year" | "month", value: boolean) => {
      if (value) {
        let { prevDayCount } = init(dateInstance!.add(1, type).toDate());
        updateData({ week, prevDayCount });
      } else {
        let { prevDayCount } = init(dateInstance!.subtract(1, type).toDate());
        updateData({ week, prevDayCount });
      }
    };

    return {
      currDay,
      render,
      year,
      month,
      currSelectIndex,
      format,
      fillZero,
      handleCellClick,
      handleBtnClick,
      addDisabledStyle,
      addCurrentStyle,
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

  .toolbar {
    // background-color: crimson;
    padding: 10px 0;

    .op-btn {
      cursor: pointer;
      i {
        font-size: 1.2rem;
        vertical-align: middle;
      }
    }

    .details {
      padding: 0 60px;
    }
  }

  .cell {
    padding: 10px;
    color: #606266;
    cursor: pointer;
    font-size: 0.8rem;
    touch-action: manipulation;

    span {
      width: 24px;
      height: 24px;
      display: inline-block;
      text-align: center;
      line-height: 24px;
      border-radius: 50%;
    }

    &:hover {
      color: #409eff;
    }
  }

  .cell_select span {
    color: #fff;
    font-weight: 500;
    background-color: #409eff;
  }

  .cell_current {
    color: #409eff !important;
  }

  .cell_disabled {
    color: #c0c4cc;
  }

  table {
    display: inline-block;
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

