<script setup lang="ts">
import {useTokenList} from "~/composables/useTokenList";

const { connectWallet, account, balance } = useWallet()
const {balances, loadBalances } = useTokenList()
const {priceMap} =  useTokenPrices()

onMounted(() => {
  connectWallet()
  loadBalances()
})
const goToQuick = () => {
  navigateTo('/quick')
}
const handleClick= () => {
  console.log('click')
}
</script>

<template>
  <div class="p-4 space-y-4">
    <el-row>
      <el-button type="primary" @click="handleClick">
        点我一下
      </el-button>

      <!-- 快速跳转按钮 -->
      <el-button type="success" @click="goToQuick">
        QuickSwap
      </el-button>

      <!-- 钱包连接按钮 -->
      <el-button type="warning" @click="connectWallet">
        连接钱包
      </el-button>
    </el-row>
    <!-- 主按钮 -->


    <!-- 显示钱包信息 -->
    <el-card v-if="account" class="mt-4" shadow="hover">
      <template #header>
        <span>钱包信息</span>
      </template>

      <el-descriptions :column="1" border>
        <el-descriptions-item label="钱包地址">
          {{ account }}
        </el-descriptions-item>
        <el-descriptions-item label="POL 余额">
          {{ balance }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
  <div class="p-4">
    <el-card shadow="hover">
      <template #header>
        <span>代币余额</span>
      </template>

      <el-table :data="balances" style="width: 100%" border>
        <el-table-column prop="name" label="代币" width="120" />
        <el-table-column prop="balance" label="余额" />
        <el-table-column label="价格（USD）">
          <template #default="{ row }">
            <el-tag type="success">${{ priceMap[row.name] ?? 0 }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>