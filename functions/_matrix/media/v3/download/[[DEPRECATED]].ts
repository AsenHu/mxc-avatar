import { generateFromString } from 'lib/gen_avatar'

async function onRequestGet(context: { request: Request }) {
    // 获取信息
    const url = new URL(context.request.url);
    const path = url.pathname.split('/');
    const mediaId = path[6];
    const fileName = path[7];

    let disposition = "attachment";
    // 检查 fileName 是否存在
    if (fileName) {
        disposition = `attachment; filename="${fileName}"`;
    }

    // 生成头像
    const svg = await generateFromString(mediaId);

    // 返回 SVG
    return new Response(svg, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'image/svg+xml',
            'Content-Disposition': disposition,
        },
    });
}

async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Max-Age': '86400',
        }
    });
}

export { onRequestGet, onRequestOptions }