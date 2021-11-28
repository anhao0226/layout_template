import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router';
import 'element-plus/dist/index.css';
import { setupStore } from '@/store';
import { i18n } from '@/plugins/i18n';
import { useECharts } from "@/plugins/echarts";
import { useElementPlus } from "@/plugins/element-plus";
import "nprogress/nprogress.css";
import "@/styles/index.scss";
import 'remixicon/fonts/remixicon.css'

const app = createApp(App);
app.use(router).use(i18n).use(useElementPlus).use(useECharts).use(setupStore).mount('#app');
