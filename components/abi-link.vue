<template>
  <div class="inline-block">
    <el-link class="ml-5" type="primary" :href="`https://polygonscan.com/address/${address}`" target="_blank">PolygonScan</el-link>
    <el-link class="ml-5" type="primary" :href="`/abi?address=${address}`" target="_blank">ABI</el-link>
  </div>
</template>
<script setup>
defineProps({ address: String })
</script>