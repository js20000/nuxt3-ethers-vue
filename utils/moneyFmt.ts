
export function fmt(num:any, pattern:string) {
    num = Number(num)
    if (!isNaN(num)) {
        if (num > 0) {
            num = num + 0.00000001
        }
        if (num < 0) {
            num = num - 0.00000001
        }
        const strarr:string[] = num ? parseFloat(num).toFixed(7).toString().split('.') : ['0']
        const fmtarr:string[] = pattern ? pattern.split('.') : ['']
        let retstr:string = ''
        // 整数部分
        let str = strarr[0]
        let fmt = fmtarr[0]
        let i = str.length - 1
        let comma = false
        for (let f = fmt.length - 1; f >= 0; f--) {
            switch (fmt.substr(f, 1)) {
                case '#':
                    if (i >= 0) {
                        retstr = str.substr(i--, 1) + retstr
                    }
                    break
                case '0':
                    if (i >= 0) {
                        retstr = str.substr(i--, 1) + retstr
                    } else {
                        retstr = '0' + retstr
                    }
                    break
                case ',':
                    comma = true
                    retstr = ',' + retstr
                    break
            }
        }
        if (i >= 0) {
            if (comma) {
                const l = str.length
                for (; i >= 0; i--) {
                    retstr = str.substr(i, 1) + retstr
                    if (i > 0 && (l - i) % 3 == 0) {
                        retstr = ',' + retstr
                    }
                }
            } else {
                retstr = str.substr(0, i + 1) + retstr
            }
        }
        retstr = retstr + '.'
        // 处理小数部分
        str = strarr.length > 1 ? strarr[1].replace(/0+$/, '') : ''
        fmt = fmtarr.length > 1 ? fmtarr[1] : ''
        i = 0
        for (let f = 0; f < fmt.length; f++) {
            switch (fmt.substr(f, 1)) {
                case '#':
                    if (i < str.length) {
                        retstr += str.substr(i++, 1)
                    }
                    break
                case '0':
                    if (i < str.length) {
                        retstr += str.substr(i++, 1)
                    } else {
                        retstr += '0'
                    }
                    break
            }
        }
        return retstr.replace(/^,+/, '').replace(/\.$/, '').replace(/^\-,/, '-')
    } else {
        return ''
    }
}



export function toWeight(value:string|number) {
    return fmt(value, '#,###.####')
}

export function toMoney(value:string|number) {
    return fmt(value, '#,###.00')
}

export function toPrice(value:string|number) {
    return fmt(value, '#,###.######')
}

export function toDecimal(num:string|number, scale:number) {
    let f = typeof num === 'string' ? parseFloat(num) : num
    if (isNaN(f)) {
        return 0
    }
    let s = 100
    if (scale !== undefined) {
        if (!isNaN(scale)) {
            if (scale >= 0) {
                s = Math.pow(10, scale)
            } else {
                s = 100
            }
        }
    }
    f = Math.round(f * s) / s
    return f
}
export function isNumeric(value:string|number) {
    if (typeof value === 'number') {
        return isFinite(value);
    }

    // 如果值的类型是 string，尝试将其转换为数字并检查是否是有限数字
    const parsed = parseFloat(value);
    return !isNaN(parsed) && isFinite(parsed);

}
