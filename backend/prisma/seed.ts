import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.book.createMany({
    data: [
      {
        title: "The Silent Forest",
        description: "A mystery novel set in a forgotten woodland.",
        price: 19.99,
        image: "https://placehold.co/300x400"
      },
      {
        title: "Midnight Coffee",
        description: "A cozy romance in a small-town café.",
        price: 14.99,
        image: "https://placehold.co/300x400"
      },
      {
        title: "Ocean of Stars",
        description: "A sci-fi adventure across galaxies.",
        price: 24.99,
        image: "https://placehold.co/300x400"
      }
    ]
  })

  console.log("🌱 Database seeded!")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())