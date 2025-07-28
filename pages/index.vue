<script setup lang="ts">
import GgPrice from "~/components/gg-price.vue";
import type {Token} from "~/tokens";

const { connectWallet, address, balance,loadGas } = useWallet()
const {balances, loadBalances } = useTokenList()

onMounted( async () => {
 await initWallet()
  await loadBalances()
})
const initWallet=async ()=>{
  await connectWallet()
  await loadGas()
}
watch(balances, () => {
  useTokenPrices(balances.value)
});
const goToQuick = () => {
  navigateTo('/quick')
}
const handleClick= () => {
  console.log('click')
}
function getSummaries({ columns, data }: any) {
  const sums: any[] = []

  columns.forEach((column: any, index: number) => {
    if (index === 0) {
      sums[index] = '合计'
    } else if (column.label === '金额（USD）') {
      const total = data.reduce((acc: number, row: any) => {
        const price = row.price?? 0
        return acc + row.balance * price
      }, 0)
      sums[index] = `$${total.toFixed(2)}`
    } else {
      sums[index] = ''
    }
  })

  return sums
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
      <el-button type="warning" @click="initWallet">
        连接钱包
      </el-button>
    </el-row>

    <!-- 主按钮 -->


    <!-- 显示钱包信息 -->
    <el-card v-if="address" class="mt-4" shadow="hover">
      <template #header>
        <span>钱包信息</span>
      </template>

      <el-descriptions :column="1" border>
        <el-descriptions-item label="钱包地址">
          {{ address }}
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

      <el-table :data="balances"
                show-summary
                :summary-method="getSummaries"
                style="width: 100%" border>
        <el-table-column prop="name" label="代币" width="120" />
        <el-table-column prop="balance" label="余额" />
        <el-table-column label="价格（USD）"  align="right">
          <template #default="{ row }:{ row: Token }">
            <el-tag type="success">${{ row.price?? 0 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="金额（USD）" align="right">
          <template #default="{ row }:{ row: Token }">
            <el-tag type="success"> <gg-price :value="row.balance*row.price??0"/></el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>