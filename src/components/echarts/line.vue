<template>
  <div class="charts-container">
    <!-- <echarts :option="option" :initOptions="initOptions"></echarts>
    <echarts :option="lineOptions" :initOptions="initOptions"></echarts> -->
    <echarts :option="barRenderData" :initOptions="initOptions"></echarts>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, SetupContext, watch } from "vue";
import { hasOwn } from "@/utils";

export default defineComponent({
  props: {
    data: Object,
    type: String,
    include: Array,
  },
  setup(props: any) {
    const pieOption = {
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: "50%",
          data: [],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };

    const lineOption = {
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: [],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [],
          type: "line",
        },
      ],
    };

    const barOption = {
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: "bar",
        },
      ],
    };

    const key = props.include[0]!;

    const conversion = (data: any) => {
      const statistics: Record<string, number> = {};
      data.forEach((item: any) => {
        !hasOwn(statistics, item[key]) && (statistics[item[key]] = 0);
        statistics[item[key]]++;
      });
      return statistics;
    };

    const echartLine = (data: any): { value: number[]; xAxis: string[] } => {
      const value: number[] = [];
      const xAxis: string[] = Object.keys(data);
      xAxis.forEach((key: string) => value.push(data[key]));
      return { value, xAxis };
    };

    const echartPie = (data: any) => {
      const option: any[] = [];
      for (const key in data) {
        option.push({ name: key, value: data[key] });
      }
      return option;
    };

    const option = ref({});
    const lineOptions = ref({});
    const initOptions = {
      width: 1100,
      height: 400,
    };
    const barRenderData = ref({});

    let temp = {};

    const chartTypeToggle = (index: number) => {
      switch (index) {
        case 0:
          pieOption.series[0].data = echartPie(temp) as any;
          option.value = pieOption;
          break;
        case 1:
          {
            const { xAxis, value } = echartLine(temp);
            lineOption.xAxis.data = xAxis as any;
            lineOption.series.map((item, index) => {
              const v: number[] = [];
              value.forEach((item) => v.push(item + index));
              item.data = v as any;
              return item;
            });
            option.value = lineOption;
          }
          break;
        case 2:
          {
            const { xAxis, value } = echartLine(temp);
            barOption.xAxis.data = xAxis as any;
            barOption.series.map((item, index) => {
              const v: number[] = [];
              value.forEach((item) => v.push(item + index));
              item.data = v as any;
              return item;
            });
            option.value = barOption;
          }
          break;
      }
    };

    watch(
      () => props.data,
      (newValue) => {
        temp = conversion(newValue);
        pieOption.series[0].data = echartPie(temp) as any;
        const { xAxis, value } = echartLine(temp);
        lineOption.xAxis.data = xAxis as any;
        lineOption.series.push({ data: [], type: "line" });
        lineOption.series.map((item, index) => {
          const v: number[] = [];
          value.forEach((item) => v.push(item + index));
          item.data = v as any;
          return item;
        });
        lineOptions.value = lineOption;

        barOption.xAxis.data = xAxis as any;
        barOption.series.push({ data: [], type: "bar" });
        barOption.series.map((item, index) => {
          const v: number[] = [];
          value.forEach((item) => v.push(item + index));
          item.data = v as any;
          return item;
        });
        barRenderData.value = barOption;

        option.value = pieOption;
      }
    );

    return {
      option,
      lineOptions,
      initOptions,
      barRenderData,
      chartTypeToggle,
    };
  },
});
</script>


<style lang="scss" scoped>
.charts-container {
  width: 100%;
  height: 100%;

  .echarts {
    display: inline-block;
    width: auto;
    height: auto;
  }

  //   background-color: cadetblue;
}
</style> 