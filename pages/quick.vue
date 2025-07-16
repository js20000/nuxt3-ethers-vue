<template>
  <div class="p-6">
    <el-input v-model="address" placeholder="请输入合约地址" class="w-full mb-4" clearable />
    <el-button type="primary" @click="loadAbi" :loading="loading">加载 ABI</el-button>

    <div v-if="error" class="mt-4 text-red-500">{{ error }}</div>

    <el-card class="mt-4" v-if="abi">
      <template #header>
       Main ABI 信息
      </template>
      <el-scrollbar max-height="400px">
        <pre>{{ formattedMainAbi }}</pre>
      </el-scrollbar>
    </el-card>

    <el-card class="mt-4" v-if="abi">
      <template #header>
        Implement ABI 信息
      </template>
      <el-scrollbar max-height="400px">
        <pre>{{ formattedAbi }}</pre>
      </el-scrollbar>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {ElMessage} from 'element-plus'
import {ethers} from 'ethers'

const address = ref('0x29E1888F7DD0757f2873E494463Ec389dab38D27')
const mainAbi = ref<any[] | null>(null)
const abi = ref<any[] | null>(null)
const loading = ref(false)
const error = ref('')

const API_KEY = '762C86QZQ45FUURRGA8DJUYK32C6AP6ZAG'
const RPC_URL = 'https://polygon-rpc.com'
const provider = new ethers.JsonRpcProvider(RPC_URL)

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

const loadAbi = async () => {
  loading.value = true
  abi.value = null
  error.value = ''

  try {
    const fetchedAbi = await getAbiFromExplorer(address.value)
    mainAbi.value = fetchedAbi
    const methodNames = fetchedAbi.map((item: any) => item.name)

    // 检查是否为 proxy
    if (methodNames.includes('upgradeTo') && methodNames.includes('implementation')) {
      const implAddr = await getImplementationAddress(address.value)
      ElMessage.info(`代理合约，获取逻辑合约地址: ${implAddr}`)
      abi.value = await getAbiFromExplorer(implAddr)
    } else {
      abi.value = fetchedAbi
    }
  } catch (e: any) {
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