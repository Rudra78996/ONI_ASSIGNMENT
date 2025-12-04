import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Doe',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      name: 'Jane Smith',
      password: hashedPassword,
    },
  });

  console.log('✅ Users created');

  // Create authors
  const author1 = await prisma.author.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      name: 'J.K. Rowling',
      bio: 'British author, best known for the Harry Potter series',
      birthDate: new Date('1965-07-31'),
    },
  });

  const author2 = await prisma.author.upsert({
    where: { id: '2' },
    update: {},
    create: {
      id: '2',
      name: 'George R.R. Martin',
      bio: 'American novelist and short story writer, known for A Song of Ice and Fire',
      birthDate: new Date('1948-09-20'),
    },
  });

  const author3 = await prisma.author.upsert({
    where: { id: '3' },
    update: {},
    create: {
      id: '3',
      name: 'Agatha Christie',
      bio: 'English writer known for detective novels',
      birthDate: new Date('1890-09-15'),
    },
  });

  console.log('✅ Authors created');

  // Create books
  const book1 = await prisma.book.create({
    data: {
      title: "Harry Potter and the Philosopher's Stone",
      description: 'First book in the Harry Potter series',
      publishedAt: new Date('1997-06-26'),
      authorId: author1.id,
    },
  });

  const book2 = await prisma.book.create({
    data: {
      title: 'Harry Potter and the Chamber of Secrets',
      description: 'Second book in the Harry Potter series',
      publishedAt: new Date('1998-07-02'),
      authorId: author1.id,
    },
  });

  const book3 = await prisma.book.create({
    data: {
      title: 'A Game of Thrones',
      description: 'First book in A Song of Ice and Fire series',
      publishedAt: new Date('1996-08-06'),
      authorId: author2.id,
    },
  });

  const book4 = await prisma.book.create({
    data: {
      title: 'Murder on the Orient Express',
      description: 'A classic detective novel featuring Hercule Poirot',
      publishedAt: new Date('1934-01-01'),
      authorId: author3.id,
    },
  });

  console.log('✅ Books created');

  // Create borrowed books
  await prisma.borrowedBook.create({
    data: {
      bookId: book1.id,
      userId: user1.id,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    },
  });

  console.log('✅ Borrowed books created');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
