async function onRequestGet(context: { request: Request }) {
    const url = new URL(context.request.url);
    const hostname = url.hostname;
    const port = url.port;

    return new Response(`{"m.server": "${hostname}:${port}"}`, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
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