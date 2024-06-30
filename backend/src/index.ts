import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'
import { userRouter } from './route/user'
import { blogRouter } from './route/blog'
// POST /api/v1/user/signup
// POST /api/v1/user/signin
// POST /api/v1/blog
// PUT /api/v1/blog
// GET /api/v1/blog/:id 
// GET /api/v1/blog/bulk



const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string
	}
}>()

app.get('/', (c) => {
	return c.text('Hello Hono!')
})

app.route("/api/v1/user", userRouter)
app.route("/api/v1/blog", blogRouter)


export default app
