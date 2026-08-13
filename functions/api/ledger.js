// Cloudflare Pages Functions - 家庭账本专属云端 API
// Endpoint: https://wang.deshui27.cn/api/ledger

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}

export async function onRequestGet(context) {
  try {
    if (context.env && context.env.FAMILY_LEDGER) {
      const data = await context.env.FAMILY_LEDGER.get('records')
      return new Response(data || '[]', {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      })
    }
  } catch (e) {}

  return new Response('[]', {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.text()
    if (context.env && context.env.FAMILY_LEDGER) {
      await context.env.FAMILY_LEDGER.put('records', body)
      return new Response(JSON.stringify({ success: true }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }
    return new Response(JSON.stringify({ success: false, message: 'FAMILY_LEDGER KV not bound yet' }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
}
