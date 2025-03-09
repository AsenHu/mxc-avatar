import { generateFromString } from 'lib/gen_avatar'

async function onRequestGet(context: { request: Request }) {
    // 获取 mediaId
    const url = new URL(context.request.url);
    const mediaId = url.pathname.split('/').pop();

    // 生成头像
    const svg = await generateFromString(mediaId);

    // 返回 SVG
    return new Response(svg, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'image/svg+xml',
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