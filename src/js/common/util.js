
const formatDate = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return (
        [year, month, day].map(formatNumber).join('/') +
        ' ' +
        [hour, minute, second].map(formatNumber).join(':')
    )
}

const formatNumber = (n) => {
    const s = n.toString()
    return s[1] ? s : '0' + s
}


/**
 * 发送ajax请求
 * @param {String} url
 * @param {Function} succ 加载成功回调函数
 * @param {Function} onProgress 加载进度回调函数
 * @param {Function} onError 错误回调函数
 */
function fileLoader(option) {
    const opt = {
        url: '',
        type: 'json'
    };
    for (const p in option) {
        if (option[p]) opt[p] = option[p];
    }

    return new Promise((resolve, reject) => {
        if (!opt.url) reject('url is empty');
        const request = new XMLHttpRequest();
        // @ts-ignore
        request.responseType = opt.type;
        request.open('GET', opt.url, true);
        request.addEventListener('load', function (event) {
            if (this.status === 200 || this.status === 0) {
                if (this.status === 0) console.warn('FileLoader: HTTP Status 0 received.');
                resolve(this.response);
            } else {
                reject(event);
            }
        }, false);

        // request.addEventListener('progress', onProgress, false);
        request.addEventListener('error', reject, false);
        request.addEventListener('abort', reject, false);
        request.send(null);
    });
}

/**
 * 16进制字符串转换为ArrayBuffer
 * @param str 
 */
function hexStringToArrayBuffer(str) {
    if (!str) return new ArrayBuffer(0);

    const len = str.length;
    const buffer = new ArrayBuffer(len);
    const dataView = new DataView(buffer)

    let ind = 0;
    for (let i = 0; i < len; i += 2) {
        const code = parseInt(str.substr(i, 2), 16)
        dataView.setUint8(ind, code)
        ind++
    }

    return buffer;
}

/**
 * DataView转换为16进制字符串
 * @param dataView 
 */
function dataViewToHexString(dataView) {
    let hexStr = '';
    for (let i = 0; i < dataView.byteLength; i++) {
        const str = dataView.getUint8(i);
        let hex = (str & 0xff).toString(16);
        hex = (hex.length === 1) ? '0' + hex : hex;
        hexStr += hex;
    }
    return hexStr;
}

export {
    formatDate,
    fileLoader,
    hexStringToArrayBuffer,
    dataViewToHexString,
};
