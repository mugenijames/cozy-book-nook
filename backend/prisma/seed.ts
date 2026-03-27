import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample books if none exist
  const bookCount = await prisma.book.count();
  
  if (bookCount === 0) {
    await prisma.book.createMany({
      data: [
        {
          title: "Dear Dad",
          author: "David Emuria",
          slug: "dear-dad",
          description: "A heartfelt letter to fathers everywhere. This book explores the journey of healing, forgiveness, and finding purpose in pain.",
          genre: "Self-Help",
          publishedYear: 2024,
          pages: 250,
          rating: 4.8
        },
        {
          title: "Why Church Relationships Fail",
          author: "David Emuria",
          slug: "church-relationships",
          description: "Understanding the dynamics of healthy church relationships and how to build lasting connections.",
          genre: "Christian Living",
          publishedYear: 2023,
          pages: 180,
          rating: 4.5
        },
        {
          title: "Arise Turkana",
          author: "David Emuria",
          slug: "arise-turkana",
          description: "A call to action for the people of Turkana to rise and transform their community.",
          genre: "Community Development",
          publishedYear: 2024,
          pages: 320,
          rating: 4.9
        }
      ]
    });
    console.log(`✅ Created ${bookCount} books`);
  } else {
    console.log(`📚 ${bookCount} books already exist`);
  }
}

main()
  .catch(e => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });