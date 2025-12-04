import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FilterBooksDto } from './dto/filter-books.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    return this.prisma.book.create({
      data: createBookDto,
      include: {
        author: true,
      },
    });
  }

  async findAll(filters?: FilterBooksDto) {
    const where: any = {};

    if (filters?.authorId) {
      where.authorId = filters.authorId;
    }

    if (filters?.borrowed !== undefined) {
      if (filters.borrowed) {
        where.borrowedBooks = {
          some: {
            returnedAt: null,
          },
        };
      } else {
        where.borrowedBooks = {
          none: {
            returnedAt: null,
          },
        };
      }
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.book.findMany({
      where,
      include: {
        author: true,
        borrowedBooks: {
          where: {
            returnedAt: null,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        author: true,
        borrowedBooks: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.book.update({
      where: { id },
      data: updateBookDto,
      include: {
        author: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.book.delete({
      where: { id },
    });
  }
}
