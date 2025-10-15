import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

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
app.use('/*', serveStatic({ root: './' }))

// Fallback to appropriate index.html for SPA routing
app.get('/admin/*', serveStatic({ path: './admin/index.html' }))
app.get('*', serveStatic({ path: './mobile/index.html' }))

export default app
