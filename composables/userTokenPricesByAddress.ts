// composables/useTokenPrices.ts

export async function userTokenPricesByAddress(TOKENS): Promise<Record<string, number>> {
    const priceMap: Record<string, number> = {}

    for (const token of TOKENS) {
        if(token.coingeckoId){
            continue;
        }
        const url = `https://api.coingecko.com/api/v3/simple/token_price/polygon-pos?contract_addresses=${token.address.toLowerCase()}&vs_currencies=usd`
        try {
            const res = await fetch(url)
            const data = await res.json()
            token.price = data[token.address.toLowerCase()]?.usd ?? 0
        } catch (e) {
            console.error(`❌ 获取 ${token.name} 价格失败`, e)
            token.price = 0
        }

        // ✅ 避免被限流，每次请求之间加一点延迟（可选）
        await new Promise(r => setTimeout(r, 500))
    }

    return priceMap
}