<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
onMounted(() => {
  const { params, query } = useRoute();
  const { replace } = useRouter();
  console.log(params);
  replace({
    path: `/${params.path}`,
    query,
  });
});
</script>
