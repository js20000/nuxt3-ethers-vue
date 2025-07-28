// composables/useTokenList.ts

// @ts-ignore
import { ref } from 'vue'
// @ts-ignore
import { BrowserProvider, Contract, formatUnits } from 'ethers'

export type VaultData = {
    balance: Ref<string | number>
    totalSupply: Ref<string | number>
    poolAddress: Ref<string>
    address: Ref<string>
    loadBalance: () => Promise<void>
    loadVaultPoolAddress: () => Promise<void>
}

const ERC20_ABI = [
    "function totalSupply() external view returns (uint256)",
    'function balanceOf(address) view returns (uint256)',
    'function decimals() view returns (uint8)',
]
// tokens.ts

export function useToken(token:string):VaultData {
    const address = ref<string>(token)
    const balance = ref<string>('')
    const totalSupply = ref<string>('')
    const poolAddress= ref<string>('')
    async function loadBalance(userAddress?:string) {
        const { provider, address, getSigner ,isConnected,connectWallet} = useWallet()
        await connectWallet()
        const signer = await getSigner()
        userAddress = userAddress || await signer.getAddress()
        console.log("userAddress:",userAddress)
        const contract = new Contract(token, ERC20_ABI, provider.value)
        const [rawTotalSupply, rawBalance, decimals] = await Promise.all([
            contract.totalSupply(),
            contract.balanceOf(userAddress),
            contract.decimals()
        ])


        balance.value = formatUnits(rawBalance, decimals)
        totalSupply.value = formatUnits(rawTotalSupply, decimals)
    }

    const vaultAbi = [
        "function pool() view returns (address)"
    ]
    async function loadVaultPoolAddress() {
        if (!window.ethereum) {
            console.warn('请安装 MetaMask')
            return
        }

        const provider = new BrowserProvider(window.ethereum)
        const vaultContract = new Contract(address.value, vaultAbi, provider)
        poolAddress.value = await vaultContract.pool()

        // console.log("Vault 对应的流动性池地址:", poolAddress)
    }

    return {
        balance,
        totalSupply,
        loadBalance,
        address,
        loadVaultPoolAddress,
        poolAddress
    }
}