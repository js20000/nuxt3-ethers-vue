<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {type Addressable, Contract} from 'ethers'
import {ElMessage} from "element-plus";
import {getNameByAddress} from "../tokens";
import Erc20Balance from "~/components/erc20-balance.vue";
import type {VaultData} from "~/composables/useToken";
import AbiLink from "~/components/abi-link.vue";

const props = defineProps<{
  poolAddress:  string| Addressable
  account: VaultData
}>()
// 最小 ABI，只包含需要查询的函数
const POOL_ABI = [
  'function token0() view returns (address)',
  'function token1() view returns (address)',
  'function liquidity() view returns (uint128)',
  "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  'function globalState() view returns (uint160 price, int24 tick, uint16 fee, uint16 timepointIndex, uint8 communityFeeToken0, uint8 communityFeeToken1, bool unlocked)'
]

const {provider ,connectWallet,isConnected,address} =useWallet()

const token0 = ref('')
const token1 = ref('')
const token0Q = ref('')
const token1Q = ref('')
const token0R=ref('')
const token1R=ref('')
// 定义响应式变量
const sqrtPriceX96 = ref('')
const price = ref('')
const tick = ref('')
const fee = ref('')
const timepointIndex = ref('')
const communityFee0 = ref('')
const communityFee1 = ref('')
const unlocked = ref(false)
const liquidity=ref('')

async function loadPoolInfo() {
  if(!isConnected.value){
    await connectWallet()
  }
  const contract = new Contract(props.poolAddress, POOL_ABI, provider.value)
  console.log("poolAddress",props.poolAddress)
  token0.value = await contract.token0()
  token1.value = await contract.token1()
  liquidity.value = (await contract.liquidity()).toString()

  const [
    priceRaw,
    tickRaw,
    feeRaw,
    timepointIndexRaw,
    fee0Raw,
    fee1Raw,
    unlockedRaw
  ] = await contract.globalState()

  // 设置变量
  sqrtPriceX96.value = priceRaw.toString()
  price.value = Math.pow(Number(priceRaw) / 2 ** 96, 2).toFixed(6)
  tick.value =   tickRaw
  fee.value = (Number(feeRaw)/10000 ).toFixed(4)+'%'
  timepointIndex.value = timepointIndexRaw.toString()
  communityFee0.value = fee0Raw
  communityFee1.value = fee1Raw
  unlocked.value = unlockedRaw
  await loadTicks()
}
async function loadTicks(){
  const query = `
  {
    positions(where: { owner: "${address.value}" }) {
      id
      tickLower { tickIdx }
      tickUpper { tickIdx }
      liquidity
      pool {
        id
        token0 { symbol }
        token1 { symbol }
      }
    }
  }
`;

  const subgraphUrl = "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon";

  async function getPositions() {
    const res = await fetch(subgraphUrl, {   method: 'POST',
      body:query
    });
    const positions = res.data.data.positions;
    console.log("找到仓位:", positions);
  }
  //查ticks 先不查了
  // await getPositions();
}

onMounted(() => {
  if(props.poolAddress){
    loadPoolInfo()
  }
})
watch(()=>props.poolAddress, async ()=>{
  if(props.poolAddress){
    await loadPoolInfo()
  }
})

function getRealPrice(sqrtPriceX96, decimals0, decimals1) {
  const Q96 = BigInt(2) ** BigInt(96);
  const sqrt = Number(sqrtPriceX96) / Number(Q96);
  const price = sqrt ** 2;
  return price * 10 ** (decimals0 - decimals1);
}
const calPrice=computed(()=>{
  return getRealPrice(sqrtPriceX96.value, 6, 18)
});
const refresh = async () => {
  await loadPoolInfo()
  ElMessage.success('刷新成功')
}
const toMe=computed(()=> {
  if(!token0.value){
    return 0
  }
  return Number(token0.value)*Number(props.account.balance.value)/Number(props.account.totalSupply.value)
})

</script>

<template>

  <el-descriptions title=" " :column="2" border>
    <el-descriptions-item label="合约地址">
      {{ poolAddress }}
      <abi-link :address="account.poolAddress.value" style="margin-left: -20px;"/>
    </el-descriptions-item>
    <el-descriptions-item label="相关链接">

    </el-descriptions-item>

    <el-descriptions-item label="Token0">
      {{ token0 }}
      <abi-link :address="token0"  style="margin-left: -20px;"/>
    </el-descriptions-item>

    <el-descriptions-item label="Token1">
      {{ token1 }}
      <abi-link :address="token1" style="margin-left: -20px;" />
    </el-descriptions-item>
    <el-descriptions-item :label="getNameByAddress(token0)">
      <erc20-balance :user-address="props.poolAddress" :contract-address="token0" v-model="token0Q" />
      {{toMe}}
    </el-descriptions-item>
    <el-descriptions-item :label="getNameByAddress(token1)">
      <erc20-balance :user-address="props.poolAddress" :contract-address="token1" v-model="token1Q"  />
    </el-descriptions-item>
    <el-descriptions-item label="价格">
      {{calPrice}}
    </el-descriptions-item>
    <el-descriptions-item label="价格">
       {{1/calPrice}}
    </el-descriptions-item>
    <el-descriptions-item label="当前价格 (√P²)">
      {{ price }}<br/>
    </el-descriptions-item>
    <el-descriptions-item label="√P (sqrtPriceX96)">
      {{ sqrtPriceX96 }}
    </el-descriptions-item>
    <el-descriptions-item label="流动性">
      {{ liquidity }}
    </el-descriptions-item>
    <el-descriptions-item label="当前 Tick">
      {{ tick }}
    </el-descriptions-item>
    <el-descriptions-item label="手续费费率">
      {{ fee }}
    </el-descriptions-item>
    <el-descriptions-item label="时间点索引">
      {{ timepointIndex }}
    </el-descriptions-item>
    <el-descriptions-item label="社区费率 Token0">
      {{ communityFee0 }}
    </el-descriptions-item>
    <el-descriptions-item label="社区费率 Token1">
      {{ communityFee1 }}
    </el-descriptions-item>
    <el-descriptions-item label="是否解锁">
      <el-tag :type="unlocked ? 'success' : 'danger'">
        {{ unlocked ? '未锁定 (可操作)' : '已锁定' }}
      </el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="">
      <el-link type="primary" @click="refresh">Refresh</el-link>
    </el-descriptions-item>
  </el-descriptions>
</template>