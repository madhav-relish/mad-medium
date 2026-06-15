const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const guestEmail = 'guestuser@gmail.com';
  const guestPassword = 'guest@1234';

  const guestUser = await prisma.user.upsert({
    where: { email: guestEmail },
    update: {
      name: 'Guest',
      password: guestPassword,
    },
    create: {
      email: guestEmail,
      name: 'Guest',
      password: guestPassword,
    },
  });

  await prisma.post.deleteMany({
    where: { authorId: guestUser.id },
  });

  const posts = [
    {
      title: 'TypeScript as a Safety Net for Fast-Moving Teams',
      content:
        'TypeScript is most valuable when teams move quickly. Strong types reduce accidental regressions, make refactors safer, and turn interfaces into living documentation.',
      published: true,
    },
    {
      title: 'Designing APIs That Stay Pleasant to Use',
      content:
        'Good APIs feel boring in the best way. Clear names, predictable response shapes, and consistent error handling save every downstream team time.',
      published: true,
    },
    {
      title: 'Why Edge Deployments Change the Release Cycle',
      content:
        'Shipping closer to users cuts latency and removes a lot of deployment friction. The real win is faster feedback loops, especially for small product changes.',
      published: true,
    },
    {
      title: 'Draft: Choosing the Right Database Indexes',
      content:
        'Indexes are a tradeoff, not a checkbox. The draft walks through how to reason about write cost, query patterns, and the danger of over-indexing.',
      published: false,
    },
    {
      title: 'Prisma Migrations Without the Guesswork',
      content:
        'The safest migrations are the ones you can explain in a sentence. Small schema changes, clean rollback plans, and repeatable seeds keep local and remote databases aligned.',
      published: true,
    },
    {
      title: 'Draft: Auth Flows People Actually Finish',
      content:
        'Great authentication UX is invisible. The draft covers short forms, helpful validation, and why too many steps cause drop-off.',
      published: false,
    },
    {
      title: 'Building UI Components That Age Well',
      content:
        'Reusable components last longer when they have one obvious purpose. Stable props, sensible defaults, and simple composition make future changes cheaper.',
      published: true,
    },
  ];

  await prisma.post.createMany({
    data: posts.map((post) => ({
      ...post,
      authorId: guestUser.id,
    })),
  });

  console.log(`Seeded guest user and ${posts.length} sample blogs.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });