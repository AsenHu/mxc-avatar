import { generateFromString } from 'lib/gen_avatar'

const onRequestGet = async (context: { request: Request }) => {
    // 获取 mediaId
    const url = new URL(context.request.url);
    const mediaId = url.pathname.split('/').pop();

    // 生成头像
    const svg = await generateFromString(mediaId);

    /*返回 SVG
    返回的内容为 multipart/mixed 类型，包含 SVG 和一些额外的信息
    第一部分是一个 JSON 对象，目前是空的
    它的 Content-Type 是 application/json
    第二部分是生成的 SVG
    它的 Content-Type 是 image/svg+xml
    它的 Content-Disposition 是 inline; filename="avatar.svg" */
    return new Response(
        `--boundary\nContent-Type: application/json\n\n{}\n--boundary\nContent-Type: image/svg+xml\nContent-Disposition: attachment; filename="avatar.svg"\n\n${svg}\n--boundary--`,
        {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'multipart/mixed; boundary=boundary',
            },
        },
    );
}

const onRequestOptions = async () => {
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