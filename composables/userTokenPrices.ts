import { ref,watch } from 'vue'
import {userTokenPricesByAddress} from "~/composables/userTokenPricesByAddress";

export function useTokenPrices(balances) {
    const priceMap = ref<Record<string, number>>({})
    const map: Record<string, number> = {}
    userTokenPricesByAddress(balances).then(r => {
       console.log("price by address over!")
    })
    const ids =balances.filter(x=>x.coingeckoId).map(t => t.coingeckoId).join(',')
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
    const { data, error } = useFetch<Record<string, { usd: number }>>(url, { server: false })

    watch(data, () => {
        if (error.value) {
            console.error('获取价格失败:', error.value)
            priceMap.value = {}
            return
        }
        if (data.value) {
            for (const token of balances) {
                if(token.coingeckoId){
                    token.price=data.value[token.coingeckoId]?.usd ?? 0
                }
            }
        }
    }, { immediate: true })  // ✅ 加上它，首次 data 就会触发回调
    return { balances}
}