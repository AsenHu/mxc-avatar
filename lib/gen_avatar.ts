interface AvatarData {
    path: string[],
    bg: string,
    invBg: string,
    el: string,
    invEl: string,
}

export async function generateFromString(id: string): Promise<string> {
    // 获取 id 的 SHA2-256 哈希值
    const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(id)))

    // 取出前 3 个字节作为背景色以及反色
    const bg = byteToRgb(hash.slice(0, 3))
    const invBg = byteToInvRgb(hash.slice(0, 3))

    // 再取出 3 个字节作为前景色以及反色
    const el = byteToRgb(hash.slice(3, 6))
    const invEl = byteToInvRgb(hash.slice(3, 6))

    // 取出 6 个字节作为图案
    const pattern = hash.slice(6, 12)

    const data: AvatarData = {
        path: [
            generatePath(pattern[0], pattern[1], 2),
            generatePath(pattern[2], pattern[3], 1),
            generatePath(pattern[4], pattern[5], 0),
        ],
        bg,
        invBg,
        el,
        invEl,
    }

    return generateSVG(data)
}

function byteToRgb(bytes: Uint8Array): string {
    return `${bytes[0]},${bytes[1]},${bytes[2]}`
}

function byteToInvRgb(bytes: Uint8Array): string {
    return `${255 - bytes[0]},${255 - bytes[1]},${255 - bytes[2]}`
}

function generatePath(curveVal: number, posVal: number, index: number) {
    // 画布大小为 300x300，中轴线为 150
    const cVal = curveVal;
    const bigC = 300 - cVal; // cVal 和 bigC 是决定曲线形状的两个控制点，这两个点和画布的中轴线对称
    const pos = posVal;
    const basePos = 100 + pos + 200 * index;
    const negPos = 200 - pos - 200 * index; // pos 和 negPos 是决定曲线高度的两个控制点，这两个点和画布的中轴线对称

    /* m 150 ${basePos} 移动到起始点
    Q ${bigC} ${cVal} ${negPos} 150 前两个是控制点的坐标，后两个是终点的坐标
    Q ${bigC} ${bigC} 150 ${negPos} 它会从上一个点继续绘制
    Q ${cVal} ${bigC} ${basePos} 150
    Q ${cVal} ${cVal} 150 ${basePos} z 封闭路径 */

    // 这个 SVG 其实可以更短，这里为了方便理解，写得比较冗长
    return `m 150 ${basePos} 
    Q ${bigC} ${cVal} ${negPos} 150 
    Q ${bigC} ${bigC} 150 ${negPos} 
    Q ${cVal} ${bigC} ${basePos} 150 
    Q ${cVal} ${cVal} 150 ${basePos} z`;
}

function generateSVG(data: AvatarData): string {
    return `<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <rect id="bg" width="300" height="300" fill="rgb(${data.bg})" />
        <path d="${data.path[0]}" fill="rgb(${data.el})" />
        <path d="${data.path[1]}" fill="rgb(${data.invEl})" />
        <path d="${data.path[2]}" fill="rgb(${data.invBg})" />
    </svg>`;
}