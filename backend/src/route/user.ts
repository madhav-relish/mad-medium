import { Hono } from "hono";

import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import { signinInput } from "@madhavsingh203/mad-medium-common";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

interface CustomError extends Error {
  code?: string;
}


userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);

  if (!success) {
    c.status(400);
    return c.json({ error: "invalid input" });
  }

  try {
    const user = await prisma.user.create({
      data: {
        email: body?.email,
        password: body?.password,
        name: body?.name
      },
    });

    console.log(user)
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({ jwt });
  } catch (e) {
    console.log(e)
    if ((e as any).code === "P2002") {
      c.status(400);
      return c.json({ error: "Email already exists!" });
    }
    c.status(403);
    return c.json({ error: "error while signing up", e });
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();

  const { success } = signinInput.safeParse(body);
  if (!success) {
    c.status(400);
    return c.json({ error: "Invalid Input" });
  }
  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (!user) {
    c.status(403);
    return c.json({ error: "User not found" });
  }

  console.log(user)
  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({ id: user.id, token: jwt, username: user.name  });
});
