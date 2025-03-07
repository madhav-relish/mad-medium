


import { createPost, signinInput, updatePost } from '@madhavsingh203/mad-medium-common'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'


export const blogRouter = new Hono<{
	Bindings: {
		JWT_SECRET: string,
		DATABASE_URL: string
	},
	Variables: {
		userId: string
	}
}>()

blogRouter.use('/*', async (c, next) => {
	//if not, we return the user a 403 status code
	try {
		//get the header
		const header = c.req.header("authorization") || ""
		// if the header is correct, user can proceed
		if (!header) {
			c.status(401)
			return c.json({
				message: "Unatuhorized"
			})
		}
		const token = header.split(" ")[1]


		//verify the jwt
		const response = await verify(token, c.env.JWT_SECRET)
		if (response) {
			c.set("userId", String(response.id))
			await next()
		} else {
			c.status(403)
			return c.json({ error: "User is not authorized" })
		}
	} catch (error) {
		c.status(403)
		return c.json({
			message: "Invalid credentials"
		})
	}
})



blogRouter.post('/', async (c) => {
	const userId = c.get('userId')
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL
	}).$extends(withAccelerate())

	const body = await c.req.json()

	const { success } = createPost.safeParse(body)

	if (!success) {
		c.status(400)
		return c.json({ error: "Invalid inputs" })
	}
	const post = await prisma.post.create({
		data: {
			title: body.title,
			content: body.content,
			authorId: userId,
			published: body.published
		}
	})

	return c.json({ id: post.id })
})

blogRouter.put('/', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL
	}).$extends(withAccelerate())
	// Get the userId
	const userId = c.get('userId')

	//get the body
	const body = await c.req.json()

	//Validating the body
	const { success } = updatePost.safeParse(body)
	if (!success) {
		c.status(400)
		return c.json({ error: "invalid input" })
	}
	const post = await prisma.post.update({
		//Find the post
		where: {
			authorId: userId,
			id: body.id
		},
		//Update the post
		data: {
			title: body.title,
			content: body.content,
			published: body.published
		}
	})

	return c.json({msg: "Post updated successfully!", post_id: post.id})
})

blogRouter.delete('/', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL
	}).$extends(withAccelerate())
	// Get the userId
	const userId = c.get('userId')

	//get the body
	const {id} = c.req.query()


	const post = await prisma.post.delete({
		//Find the post
		where: {
			authorId: userId,
			id: id
		},
	})

	return c.json({msg: "Post deleted successfully!", post_id: post.id})
})

blogRouter.get('/bulk', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());

	const {is_published, authorId} = c.req.query() 

	const posts = await prisma.post.findMany({
		where: {
			authorId: authorId,
			published: Boolean(is_published)
		}
	});

	return c.json(posts)
})

blogRouter.get('/all-of-author', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());

	const { authorId} = c.req.query() 

	const posts = await prisma.post.findMany({
		where: {
			authorId: authorId,
		}
	});

	return c.json(posts)
})

blogRouter.get('/:id', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL
	}).$extends(withAccelerate())
	const postId = c.req.param('id')

	const post = await prisma.post.findUnique({
		where: {
			id: postId
		}
	})

	return c.json(post)
})


