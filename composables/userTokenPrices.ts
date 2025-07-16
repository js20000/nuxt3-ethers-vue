import { TOKENS } from '~/tokens'
import { ref,watch } from 'vue'
import {userTokenPricesByAddress} from "~/composables/userTokenPricesByAddress";

export function useTokenPrices() {
    const priceMap = ref<Record<string, number>>({})
    const map: Record<string, number> = {}
    userTokenPricesByAddress().then(r => {
        for (const [name, price] of Object.entries(r)) {
            for (const token of TOKENS) {
                if(!token.coingeckoId){
                    map[token.name] = r[token.name]?? 0
                }
            }
        }
        priceMap.value = map
    })
    const ids =TOKENS.filter(x=>x.coingeckoId).map(t => t.coingeckoId).join(',')
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
    const { data, error } = useFetch<Record<string, { usd: number }>>(url, { server: false })

    watch(data, () => {
        if (error.value) {
            console.error('获取价格失败:', error.value)
            priceMap.value = {}
            return
        }
        if (data.value) {

            for (const token of TOKENS) {
                if(token.coingeckoId){
                    map[token.name] = data.value[token.coingeckoId]?.usd ?? 0
                }
            }
            priceMap.value = map
        }
    }, { immediate: true })  // ✅ 加上它，首次 data 就会触发回调
    return { priceMap, error }
}