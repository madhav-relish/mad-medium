import z from 'zod'

export const signupInput = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional()
})

export const signinInput = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export const createPost = z.object({
    title: z.string(),
    content: z.string(),
    published: z.boolean().optional()
})

export const updatePost = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    published: z.boolean().optional()
})

export type SignupInput = z.infer<typeof signupInput>
export type SigninInput = z.infer<typeof signinInput>
export type CreatePost = z.infer<typeof createPost>
export type updatePost = z.infer<typeof updatePost>