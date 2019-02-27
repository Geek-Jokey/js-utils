/**
 * 返回截取指定参数名后的url地址
 * @param url {string} url地址
 * @param name {string} 参数名
 * @return {string} 截取后的地址
 */
function funcUrlDel (url, name) {
    if (url.indexOf(name) === -1) {
        return url
    }
    let base = url.split('?')[0]
    let queryString = url.split('?')[1]
    let paramList = queryString.split('&')
    for (let i = 2; i < url.split('?').length; i++) {
        paramList = paramList.concat(url.split('?')[i].split('&'))
    }
    paramList = paramList.filter(param => param.indexOf(name) === -1)
    paramList = paramList.map(function (item, index) {
        return item.replace('#/', '')
    })
    if (paramList.length === 0) {
        return base
    } else {
        return `${base}?${paramList.join('&')}`
    }
}

function getQueryString (url, name) {
    if (url.indexOf(name) === -1) {
        return url
    }
    let base = url.split('?')[0]
    let queryString = url.split('?')[1]
    let paramList = queryString.split('&')
    for (let i = 2; i < url.split('?').length; i++) {
        paramList = paramList.concat(url.split('?')[i].split('&'))
    }
    paramList = paramList.filter(param => param.indexOf(name) !== -1)
    return paramList[0].split('=')[1]
}