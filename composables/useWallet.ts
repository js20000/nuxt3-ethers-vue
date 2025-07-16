import { ref } from 'vue'
import { BrowserProvider, formatEther } from 'ethers'
import {markRaw} from "vue";
export const useWallet = () => {
  const account = ref<string | null>(null)
  const balance = ref<string | null>(null)
  const provider = ref<BrowserProvider | null>(null)

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask 未安装或非浏览器环境')
    }
    await window.ethereum.request({ method: 'eth_requestAccounts' })


    provider.value = markRaw(new BrowserProvider(window.ethereum))

    const signer = await provider.value.getSigner()
    account.value = await signer.getAddress()
    const rawBalance = await provider.value.getBalance(account.value)
    balance.value = formatEther(rawBalance)
  }

  return {
    connectWallet,
    account,
    balance
  }
}