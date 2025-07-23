// composables/useTokenList.ts

// @ts-ignore
import { ref } from 'vue'
// @ts-ignore
import { BrowserProvider, Contract, formatUnits } from 'ethers'

const ERC20_ABI = [
    'function balanceOf(address) view returns (uint256)',
    'function decimals() view returns (uint8)',
]
// tokens.ts
import { TOKENS } from '~/tokens'

export function useTokenList() {
    const balances = ref<{ name: string; balance: string }[]>([])

    async function loadBalances() {
        if (!window.ethereum) {
            console.warn('请安装 MetaMask')
            return
        }

        const provider = new BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const userAddress = await signer.getAddress()

        const result: { name: string; balance: string }[] = []

        for (const token of TOKENS) {
            try {
                const contract = new Contract(token.address, ERC20_ABI, provider)
                const [rawBalance, decimals] = await Promise.all([
                    contract.balanceOf(userAddress),
                    contract.decimals(),
                ])
                result.push({
                    ...token,
                    balance: formatUnits(rawBalance, decimals),
                })
            } catch (e) {
                result.push({
                    name: token.name,
                    balance: 'Error',
                })
                console.error(`读取 ${token.name} 失败:`, e)
            }
        }

        balances.value = result
    }

    return {
        balances,
        loadBalances,
    }
}