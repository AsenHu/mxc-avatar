export async function onRequestGet(context: { request: Request }) {
    const hostname = new URL(context.request.url).hostname;
    return new Response(`{"m.server": "${hostname}"}`, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
    });
}

export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Max-Age': '86400',
        }
    });
}