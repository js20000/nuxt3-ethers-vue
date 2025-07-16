// tokens.ts

export interface Token {
    name: string
    address: string
    coingeckoId: string
}

export const TOKENS: Token[] = [
    {
        name: 'USDC.e',
        address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        coingeckoId: 'usd-coin',
    },
    {
        name: 'USDC',
        address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
        coingeckoId: 'usd-coin',
    },
    {
        name: 'USDT',
        address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        coingeckoId: 'tether',
    },
    {
        name: 'WETH',
        address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
        coingeckoId: 'weth',
    },
    {
        name: 'WBTC',
        address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
        coingeckoId: 'wrapped-bitcoin',
    },
    {
        name: 'QUICK',
        address: '0xB5C064F955D8e7F38fE0460C556a72987494eE17',
        coingeckoId: '',
    },
    {
        name: 'Compound',
        address: '0x8505b9d2254A7Ae468c0E9dd10Ccea3A837aef5c',
        coingeckoId: 'compound-governance-token',
    },
    {
        name: 'UNI',
        address: '0xb33eaad8d922b1083446dc23f610c2567fb5180f',
        coingeckoId: 'uniswap',
    },
]