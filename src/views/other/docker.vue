<template>
  <div class="docker-container">
    <template v-for="item in tbData" :key="item.Id">
      <div
        class="card"
        style="margin-left: 10px; margin-top: 10px; width: 340px"
      >
        <div class="header">{{ item.Names[0] }}</div>
        <div class="content">
          <li>
            <span>ID</span>
            <span>{{ item.Id }}</span>
          </li>
          <li>
            <span>State</span>
            <span>{{ item.State }}</span>
          </li>
          <li>
            <span>Status</span>
            <span>{{ item.Status }}</span>
          </li>
          <li>
            <span>Port</span>
            <span>{{  handlePorts(item.Ports) }}</span>
          </li>
        </div>
        <div class="active">
          <span class="item">
            <i class="ri-stop-fill icon"></i>
            <span @click="handleDockerClose(item, 'stop')">stop</span>
          </span>
          <span class="item">
            <i class="ri-play-line icon"></i>
            <span @click="handleDockerClose(item, 'start')">start</span>
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { dockerContainer, dockerCommand } from "@/api/docker.api";
import { hasOwn } from "@/utils/index"
import { ElMessage } from "element-plus";


export default defineComponent({
  setup() {
    const tbData = ref([]);

    dockerContainer().then((res) => {
      console.log(res);
      tbData.value = res;
    });

    const handlePorts = (ports: any) => {
      if(ports.length > 1 ){
        console.log(ports);
        return hasOwn(ports[0], "PublicPort") ? ports[0].PublicPort : ports[1].PublicPort
      }
      return ""
    }

    const handleDockerClose = (item: any, command: string) => {
      
      dockerCommand({ dockerID: item.Id, command }).then((res) => {
        ElMessage({
          type: "success",
          message: `${command} success`,
        })
      });
    };

    return {
      tbData,
      hasOwn,
      handleDockerClose,
      handlePorts,
    };
  },
});
</script>

<style lang="scss" scoped>
.docker-container {
  width: 100%;
  height: 100%;
  overflow: scroll;
}

.toolbar {
  height: 50px;
  background-color: #f2f5fc;
  width: 100%;

  ul {
    list-style: none;
    line-height: 50px;

    li {
      display: inline-block;
      padding: 0 20px;
      // background-color: forestgreen;
    }
  }
}

.card {
  display: inline-block;
  background-color: #fff;
  width: 350px;
  overflow: hidden;
  padding: 16px 20px;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
  transition: 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
  }

  .header {
    // background-color: firebrick;
    padding: 6px 0;
  }

  .content {
    // background-color: goldenrod;
    color: #8a8e99;
    padding: 10px 0;
    font-size: 0.8rem;
    word-break: break-all;

    li {
      border-bottom: 1px solid #eee;
      padding: 10px 0;
    }

    li span {
      display: block;
      &:first-child {
        padding: 4px 0;
        font-size: 1.1rem;
        color: #606266;
      }
    }
  }

  .active {
    padding: 6px 0;
    // background-color: rosybrown;

    .item {
      padding-right: 8px;

      span,
      i {
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
      }
      span {
        font-size: 0.85rem;
        padding: 0 6px;
      }
    }
  }
}
</style>
