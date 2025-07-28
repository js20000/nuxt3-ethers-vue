<script setup lang="ts">

import AbiLink from "~/components/abi-link.vue";
const tokens=[
  {
    name:'usdc/quick',
    account: useToken('0x20268C918a6873aBB44d7f53A4Eb92a968Bb255b')
  },
    {
    name:'usdce/quick',
    account:useToken('0x425D80e10A8103bedb57F5C08FF8d59253D6a259')
  }
]
//
const percent=(p :any) => {
  if (p.totalSupply.value > 0) {
    return (p.balance.value / p.totalSupply.value * 100).toFixed(2) + '%'
  }
  return '0%'
}
onMounted( async () => {
  for (const x of tokens) {
    await x.account.loadBalance()
    await x.account.loadVaultPoolAddress()
  }

})

</script>

<template>
  <div>
    <!-- 主按钮 -->
    <!-- 显示钱包信息 -->
    <el-card v-for="(item,index) in tokens" class="mt-0" shadow="hover">
      <template #header>
        <div class="flex  items-center w-full">
          <span class="pt-0.5 bg-amber-500">{{ item.name }}</span>
          <div class="flex space-x-2">
            <abi-link :address="item.account.address.value"/>
          </div>
          <span class="pt-0.5 pl-5">{{ item.account.address.value }}</span>
        </div>
      </template>

      <el-descriptions :column="1" border>
        <el-descriptions-item label="流动性池">
          <PoolInfo  :account="item.account" :pool-address="item.account.poolAddress.value"></PoolInfo>
        </el-descriptions-item>

        <el-descriptions-item label="我的余额">
          {{ item.account.balance }}
        </el-descriptions-item>
        <el-descriptions-item label="总供应量">
          {{ item.account.totalSupply }}
        </el-descriptions-item>
        <el-descriptions-item label="比例">
          {{ percent(item.account) }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>


  </div>

</template>