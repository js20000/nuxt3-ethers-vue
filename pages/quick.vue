<template>
  <div class="p-6">
    <el-input v-model="address" placeholder="请输入合约地址" class="w-full mb-4" clearable />
    <el-button type="primary" @click="loadAbi" :loading="loading">加载 ABI</el-button>

    <div v-if="error" class="mt-4 text-red-500">{{ error }}</div>

    <copy-code  :key="kk+'a'" :title="kk+'提示词'">
      这是实现合约的abi,合约地址{{address}}
        {{ formattedMainAbi }}

        已经有的代码:
        const { connectWallet, account, balance } = useWallet()
        const {balances, loadBalances } = useTokenList()
        onMounted( () => {
        connectWallet()
        loadBalances()
        })
        watch(balances, () => {
        useTokenPrices(balances.value)
        });
        //account我是这么取的
        //   const signer = await provider.value.getSigner()
        // account.value = await signer.getAddress()
        balance的结构
        [{
        name: 'USDC.e',
        address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        coingeckoId: 'usd-coin',
        price:0,

        }]
      1.帮我用nuxt3 vue elements-plus etherjs 写一个调用合约的查询资金池的余额代码和我在资金池冲的余额;
      2.这是ichi的合约,仔细分析abi. 给我abi.js .
      3.还缺少什么告诉我,我来给你提供.

    </copy-code>

    <copy-code :title="'Main ABI 信息,合约地址'+address" v-if="mainAbi" :code="formattedMainAbi">
    </copy-code>
    <copy-code v-if="mainAbi" :title="'Method Names'" :key="kk">
      {{mainApiMethod}}
    </copy-code>
    <copy-code :title="'Implement ABI 信息,合约地址'+abiAddress" v-if="abi" :code="formattedAbi">
    </copy-code>

  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {ElMessage} from 'element-plus'
import {ethers} from 'ethers'
import CopyCode from "~/components/CopyCode.vue";
const kk=ref(0)
const address = ref('0x14Ef96A0f7d738Db906bdD5260E46AA47B1e6E45')
const mainAbi = ref<any[] | null>(null)
const abi = ref<any[] | null>(null)
const abiAddress=ref('')
const loading = ref(false)
const error = ref('')

const API_KEY = '762C86QZQ45FUURRGA8DJUYK32C6AP6ZAG'
const RPC_URL = 'https://polygon-rpc.com'
const provider = new ethers.JsonRpcProvider(RPC_URL)
const methodNames=ref<string[]>([]);
const getAbiFromExplorer = async (addr: string) => {
  const url=`https://api.etherscan.io/v2/api?chainid=137&module=contract&action=getabi&address=${addr}&apikey=${API_KEY}`
  const res = await fetch(url)
  const json = await res.json()
  if (json.status !== '1') throw new Error(json.result || '获取 ABI 失败')
  return JSON.parse(json.result)
}

const getImplementationAddress = async (proxyAddress: string) => {
  const slot = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'
  const storage = await provider.getStorage(proxyAddress, slot)
   // 截取最后20字节
  return ethers.getAddress('0x' + storage.slice(-40))
}
const mainApiMethod= computed(() => {
  if(mainAbi.value){
    return mainAbi.value.map((item: any) => item.name)
  }
  else{
    return []
  }
})
const loadAbi = async () => {
  loading.value = true
  abi.value = null
  error.value = ''

  try {
    const fetchedAbi = await getAbiFromExplorer(address.value)
    mainAbi.value = fetchedAbi
    methodNames.value = fetchedAbi.map((item: any) => item.name)
    kk.value=kk.value+1
    // 检查是否为 proxy
    if (methodNames.value.includes('AdminChanged')) {
      const implAddr = await getImplementationAddress(address.value)
      abiAddress.value=implAddr
      ElMessage.info(`代理合约，获取逻辑合约地址: ${implAddr}`)
      abi.value = await getAbiFromExplorer(implAddr)
    } else {
      ElMessage.info(`非代理合约`)
    }
    kk.value=kk.value+1
  } catch (e: any) {
    kk.value=kk.value+1
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}
const formattedMainAbi = computed(() => JSON.stringify(mainAbi.value, null, 2))

const formattedAbi = computed(() => JSON.stringify(abi.value, null, 2))



</script>

<style scoped>

pre {
  white-space: pre-wrap;
  word-break: break-all;
  font-family: monospace;
}
</style>