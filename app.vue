<script setup lang="ts">
</script>

<template>
    <el-row type="flex" justify="start" align="middle" class="p-0 m-0 nav-bar">
      <el-button
          type="primary"
          plain
          size="small"
          round
          class="nav-btn"
          @click="$router.push('/')"
      >
        Index
      </el-button>

      <el-button
          type="success"
          plain
          size="small"
          round
          class="nav-btn"
          @click="$router.push('/ichi')"
      >
        ichi
      </el-button>
      <el-button
          type="success"
          plain
          size="small"
          round
          class="nav-btn"
          @click="$router.push('/pool')"
      >Pool
      </el-button>
      <el-button
          type="success"
          plain
          size="small"
          round
          class="nav-btn"
          @click="$router.push('/abi')"
      >
        ABI
      </el-button>
    </el-row>
  <nuxt-page/>
</template>
<style scoped>
.nav-bar {
  padding: 12px 24px;
  background-color: #f5f7fa;
}

.nav-btn {
  margin-right: 12px;
}
</style>