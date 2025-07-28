// composables/useVault.ts
import { ref } from 'vue'
import { Contract, BrowserProvider, formatUnits, parseUnits } from 'ethers'
const vaultAbi = [
    'function pool() view returns (address)',
    'function balanceOf(address) view returns (uint256)',
    'function totalSupply() view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function deposit(uint256 deposit0, uint256 deposit1, address to) returns (uint256 shares)',
    'function withdraw(uint256 shares, address to) returns (uint256 amount0, uint256 amount1)',
    'function collectFees() returns (uint256 fees0, uint256 fees1)',
] as const

export function useVault(vaultAddress: string) {
    const { provider, address, getSigner } = useWallet()

    const poolAddress = ref<string>('')
    const balance = ref<string>('0')
    const totalSupply = ref<string>('0')
    const decimals = ref<number>(18)

    const raw = {
        balance: ref<bigint>(0n),
        totalSupply: ref<bigint>(0n),
    }

    function getReadContract(p?: BrowserProvider) {
        const _p = p ?? provider.value
        if (!_p) throw new Error('provider 未初始化，请先 connectWallet')
        return new Contract(vaultAddress, vaultAbi, _p)
    }

    async function loadBasics() {
        const c = getReadContract()
        const [p, d] = await Promise.all([c.pool(), c.decimals()])
        poolAddress.value = p
        decimals.value = Number(d)
    }

    async function loadBalance() {
        const c = getReadContract()
        const [b, ts] = await Promise.all([
            c.balanceOf(address.value),
            c.totalSupply(),
        ])
        raw.balance.value = b
        raw.totalSupply.value = ts
        balance.value = formatUnits(b, decimals.value)
        totalSupply.value = formatUnits(ts, decimals.value)
    }

    async function deposit(deposit0: string, deposit1: string) {
        const signer = await getSigner()
        const c = new Contract(vaultAddress, vaultAbi, signer)
        const shares = await c.deposit(
            parseUnits(deposit0, decimals.value),
            parseUnits(deposit1, decimals.value),
            address.value
        )
        return shares.wait?.()
    }

    async function withdraw(shares: string) {
        const signer = await getSigner()
        const c = new Contract(vaultAddress, vaultAbi, signer)
        const tx = await c.withdraw(parseUnits(shares, decimals.value), address.value)
        return tx.wait?.()
    }

    async function collectFees() {
        const signer = await getSigner()
        const c = new Contract(vaultAddress, vaultAbi, signer)
        const tx = await c.collectFees()
        return tx.wait?.()
    }

    return {
        // state
        poolAddress,
        balance,
        totalSupply,
        decimals,
        raw,

        // methods
        loadBasics,
        loadBalance,
        deposit,
        withdraw,
        collectFees,
    }
}