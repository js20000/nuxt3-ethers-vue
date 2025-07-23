<script setup lang="ts">

const { connectWallet, account } = useWallet()
const usdc = useToken('0x20268C918a6873aBB44d7f53A4Eb92a968Bb255b')

const usdce = useToken('0x425D80e10A8103bedb57F5C08FF8d59253D6a259')

//0x20268C918a6873aBB44d7f53A4Eb92a968Bb255b

//
const percent=(p :any) => {
  if (p.totalSupply.value > 0) {
    return (p.balance.value / p.totalSupply.value * 100).toFixed(2) + '%'
  }
  return '0%'
}
onMounted( async () => {
  await connectWallet()
  await usdc.loadBalance()
  await usdce.loadBalance()

})
</script>

<template>
  <div class="p-4 space-y-4">
    <el-row>
      <!-- 钱包连接按钮 -->
      <el-button type="warning" @click="connectWallet">
        连接钱包
      </el-button>
    </el-row>
    <!-- 主按钮 -->


    <!-- 显示钱包信息 -->
    <el-card v-if="account" class="mt-4" shadow="hover">
      <template #header>
        <span>usdce/quick</span>
      </template>

      <el-descriptions :column="1" border>
        <el-descriptions-item label="余额">
          {{ usdce.balance }}
        </el-descriptions-item>
        <el-descriptions-item label="总供应量">
          {{usdce.totalSupply }}
        </el-descriptions-item>
        <el-descriptions-item label="比例">
          {{ percent(usdce)}}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card v-if="account" class="mt-4" shadow="hover">
      <template #header>
        <span>usdc/quick</span>
      </template>

      <el-descriptions :column="1" border>
        <el-descriptions-item label="余额">
          {{ usdc.balance }}
        </el-descriptions-item>
        <el-descriptions-item label="总供应量">
          {{usdc.totalSupply }}
        </el-descriptions-item>
        <el-descriptions-item label="比例">
          {{ percent(usdc)}}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

  </div>

</template>