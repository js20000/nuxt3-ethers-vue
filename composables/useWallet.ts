// composables/useWallet.ts
import {ref, computed, markRaw} from 'vue'
import {BrowserProvider, formatEther} from 'ethers'

export function useWallet() {
  const provider = ref<BrowserProvider | null>(null)
  const address = ref<string>('')
  const chainId = ref<number | null>(null)
  const isConnected = computed(() => !!address.value)
  const account = ref<string>('')
  const balance = ref<string>('')
  async function connectWallet() {
    if (isConnected.value) return
    if (!window.ethereum) throw new Error('请安装 MetaMask')
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    provider.value = markRaw(new BrowserProvider(window.ethereum))
    const signer = await provider.value.getSigner()
    address.value = await signer.getAddress()
    const network = await provider.value.getNetwork()
    chainId.value = Number(network.chainId)
    // 监听账户/网络切换
    window.ethereum.on?.('accountsChanged', (accs: string[]) => {
      address.value = accs?.[0] ?? ''
    })
    window.ethereum.on?.('chainChanged', () => {
      window.location.reload()
    })
  }
  async function getSigner() {
    if (!provider.value) throw new Error('请先连接钱包')
    return provider.value.getSigner()
  }

  async function loadGas() {
    if (!provider.value) throw new Error('请先连接钱包')
    const rawBalance = await provider.value.getBalance(address.value)
    balance.value = formatEther(rawBalance)
  }

  return {
    provider,
    address,
    balance,
    chainId,
    isConnected,
    connectWallet,
    loadGas,
    getSigner,
  }
}