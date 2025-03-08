import { generateFromString } from 'lib/gen_avatar'

const onRequestGet = async (context: { request: Request }) => {
    // 获取 mediaId
    const url = new URL(context.request.url);
    const mediaId = url.pathname.split('/').pop();

    // 生成头像
    const svg = await generateFromString(mediaId);

    // 返回 SVG
    return new Response(svg, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'image/svg+xml',
        },
    });
}

const onRequestOptions = async () => {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Max-Age': '86400'
        }
    });
}


export { onRequestGet, onRequestOptions }