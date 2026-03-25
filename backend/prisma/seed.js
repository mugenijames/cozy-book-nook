"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/scripts/seed.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("🌱 Starting database seeding...");
    // Clear existing books
    await prisma.book.deleteMany();
    console.log("✅ Cleared existing books");
    // Create new books
    const books = await prisma.book.createMany({
        data: [
            {
                title: "Dear Dad",
                author: "John Doe",
                slug: "dear-dad",
                description: "A heartfelt letter to fathers everywhere. This book explores the journey of healing, forgiveness, and finding purpose in pain.",
                genre: "Self-Help",
                coverImage: null,
                publishedYear: 2024,
                pages: 250,
                rating: 4.8
            },
            {
                title: "Finding Peace",
                author: "Jane Smith",
                slug: "finding-peace",
                description: "A guide to inner peace and emotional healing through mindfulness and self-discovery.",
                genre: "Wellness",
                coverImage: null,
                publishedYear: 2023,
                pages: 180,
                rating: 4.5
            },
            {
                title: "The Journey Home",
                author: "Michael Brown",
                slug: "the-journey-home",
                description: "A powerful story of redemption and the search for identity in a broken world.",
                genre: "Fiction",
                coverImage: null,
                publishedYear: 2024,
                pages: 320,
                rating: 4.9
            },
            {
                title: "Healing Hearts",
                author: "Sarah Johnson",
                slug: "healing-hearts",
                description: "Practical steps to emotional recovery and building healthy relationships.",
                genre: "Psychology",
                coverImage: null,
                publishedYear: 2023,
                pages: 210,
                rating: 4.6
            },
            {
                title: "The Silent Forest",
                author: "Emily Clark",
                slug: "the-silent-forest",
                description: "A mystery novel set in a forgotten woodland where secrets hide among the ancient trees.",
                genre: "Mystery",
                coverImage: null,
                publishedYear: 2024,
                pages: 280,
                rating: 4.7
            },
            {
                title: "Midnight Coffee",
                author: "David Miller",
                slug: "midnight-coffee",
                description: "A cozy romance in a small-town café where two strangers find love over midnight coffee.",
                genre: "Romance",
                coverImage: null,
                publishedYear: 2023,
                pages: 195,
                rating: 4.4
            },
            {
                title: "Ocean of Stars",
                author: "Lisa Wong",
                slug: "ocean-of-stars",
                description: "A sci-fi adventure across galaxies where a young explorer discovers the secrets of the universe.",
                genre: "Science Fiction",
                coverImage: null,
                publishedYear: 2024,
                pages: 450,
                rating: 4.9
            }
        ]
    });
    console.log(`🌱 Database seeded! Created ${books.count} books.`);
}
main()
    .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
