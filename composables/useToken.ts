// composables/useTokenList.ts

// @ts-ignore
import { ref } from 'vue'
// @ts-ignore
import { BrowserProvider, Contract, formatUnits } from 'ethers'

const ERC20_ABI = [
    "function totalSupply() external view returns (uint256)",
    'function balanceOf(address) view returns (uint256)',
    'function decimals() view returns (uint8)',
]
// tokens.ts

export function useToken(token:string) {
    const balance = ref<string>('')
    const totalSupply = ref<string>('')

    async function loadBalance() {
        if (!window.ethereum) {
            console.warn('请安装 MetaMask')
            return
        }

        const provider = new BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const userAddress = await signer.getAddress()

        const contract = new Contract(token, ERC20_ABI, provider)
        const [rawTotalSupply, rawBalance, decimals] = await Promise.all([
            contract.totalSupply(),
            contract.balanceOf(userAddress),
            contract.decimals()
        ])


        balance.value = formatUnits(rawBalance, decimals)
        totalSupply.value = formatUnits(rawTotalSupply, decimals)
    }
    return {
        balance,
        totalSupply,
        loadBalance
    }
}