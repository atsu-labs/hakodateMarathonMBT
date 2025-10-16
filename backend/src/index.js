import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()
// 開発時の一時対応: __STATIC_CONTENT_MANIFEST が未定義なら空オブジェクトを設定
if (typeof globalThis.__STATIC_CONTENT_MANIFEST === 'undefined') {
  globalThis.__STATIC_CONTENT_MANIFEST = {};
}
// API routes
app.get('/api/hello', (c) => {
  return c.json({ message: 'Hello from Hono on Cloudflare Workers!' })
})

app.get('/api/items', async (c) => {
  const db = c.env.DB
  try {
    const { results } = await db.prepare('SELECT * FROM items').all()
    return c.json({ items: results })
  } catch (error) {
    return c.json({ error: 'Failed to fetch items', details: error.message }, 500)
  }
})

app.post('/api/items', async (c) => {
  const db = c.env.DB
  try {
    const { name } = await c.req.json()
    await db.prepare('INSERT INTO items (name) VALUES (?)').bind(name).run()
    return c.json({ success: true, message: 'Item added' })
  } catch (error) {
    return c.json({ error: 'Failed to add item', details: error.message }, 500)
  }
})

// Serve static files from public directory
// Admin SPA is served from /admin/* paths
// Mobile SPA is served from root /* paths
// Fallback to appropriate index.html for SPA routing
app.get('/admin/*', serveStatic({ path: './admin/index.html' }))

// SPA fallback: skip static asset requests so Miniflare's site bucket can serve them
app.get('*', async (c, next) => {
  const p = c.req.path || ''
  // If request is for static assets or common static files, let the runtime (Miniflare) handle it
  if (p.startsWith('/assets/') || p === '/favicon.ico' || p === '/vite.svg' || p.startsWith('/.well-known/')) {
    return next()
  }
  // Otherwise serve SPA index
  return serveStatic({ path: './mobile/index.html' })(c, next)
})

// Serve asset files explicitly from the public folders
// Client requests /assets/... should map to files under public/mobile/assets
app.use('/assets/*', serveStatic({ root: './mobile' }))
// Admin assets live under public/admin/assets
app.use('/admin/assets/*', serveStatic({ root: './admin' }))

export default app
