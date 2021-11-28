<template>
  <div id="container">
    <div class="toolbar">
      <ul>
        <li>{{ cityDetails.province }}</li>
        <li>{{ cityDetails.city }}</li>
        <li>{{ cityDetails.district }}</li>
        <li>气温: {{ weather.temperature }}</li>
        <li>风向: {{ weather.windDirection }}</li>
        <li>风力: {{ weather.windPower }}</li>
        <li>空气湿度: {{ weather.humidity }}</li>
        <li>{{ weather.weather }}</li>
        <li><el-button @click="toPosition">Postion</el-button></li>
      </ul>
    </div>
    <div id="map-container"></div>
  </div>
</template>


<script lang="ts">
import { defineComponent, onMounted, ref, toRef, watch } from "vue";
import { ElButton } from "element-plus";
import { AMap } from "@/utils";
import { useAppStore } from "@/store";
import { userInfo } from "@/api/user.api";

export default defineComponent({
  name: "welcome",
  components: {
    ElButton,
  },
  setup() {
    const cityDetails = ref({
      city: "",
      district: "",
      province: "",
      citycode: "",
    });

    const weather = ref({
      adcode: "",
      city: "",
      humidity: "",
      info: "",
      province: "",
      reportTime: "",
      temperature: "",
      weather: "",
      windDirection: "",
      windPower: "",
    });

    let mapInstance: any = null;
    const p = { lng: 0, lat: 0 };

    const getWeather = (cityname: string) => {
      AMap.plugin("AMap.Weather", () => {
        const _weather = new AMap.Weather();
        _weather.getLive(cityname, (err: any, data: any) => {
          console.log(data);
          weather.value = err ? {} : data;
        });
      });
    };

    const store = useAppStore();
    watch(
      () => store.colorStyle,
      () => {
        console.log("Test");
        mapInstance.setMapStyle("amap://styles/grey");
        // createMap("amap://styles/grey")
      }
    );

    const toPosition = () => {
      mapInstance.panTo([p.lng, p.lat]);
      mapInstance.setZoom(16);
    };

    const createMap = (style = "amap://styles/normal") => {
      var map = new AMap.Map("map-container", {
        resizeEnable: true,
        zoom: 16,
        mapStyle: style,
      });
      map.on("complete", () => {
        mapInstance = map;

        const { lng, lat } = map.getCenter();
        p.lng = lng;
        p.lat = lat;
        var circle = new AMap.Circle({
          center: new AMap.LngLat(lng, lat),
          radius: 300,
          strokeColor: "#409EFF",
          strokeOpacity: 1,
          strokeWeight: 3,
          fillColor: "#409EFF",
          fillOpacity: 0.35,
        });

        var marker = new AMap.Marker({
          icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
          position: [lng, lat],
        });
        map.add([marker, circle]);
        map.getCity((city: any) => {
          cityDetails.value = city;
          getWeather(city.city);
        });
      });
    };

    onMounted(() => {
      createMap();
      userInfo({}).then((res) => {
        console.log(res);
      });
    });

    return {
      weather,
      cityDetails,
      toPosition,
    };
  },
});
</script>

<style lang="scss">
#container {
  width: 100%;
  height: 100%;
  position: relative;

  .toolbar {
    width: 100%;
    height: 48px;
    z-index: 1000;
    position: absolute;
    // background-color: antiquewhite;

    ul {
      height: 50px;
      list-style: none;
      display: flex;
      line-height: 48px;
      color: rgba($color: #fff, $alpha: 0.9);
      background-color: rgba($color: #000000, $alpha: 0.3);

      li {
        padding: 0 10px;
      }
    }
  }

  #map-container {
    width: 100%;
    height: 100%;
    z-index: 999;
    position: absolute;
  }
}
</style>
