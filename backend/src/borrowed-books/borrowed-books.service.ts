import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BorrowBookDto } from './dto/borrow-book.dto';

@Injectable()
export class BorrowedBooksService {
  constructor(private prisma: PrismaService) {}

  async borrowBook(borrowBookDto: BorrowBookDto) {
    // Check if book exists
    const book = await this.prisma.book.findUnique({
      where: { id: borrowBookDto.bookId },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: borrowBookDto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if book is already borrowed
    const existingBorrow = await this.prisma.borrowedBook.findFirst({
      where: {
        bookId: borrowBookDto.bookId,
        returnedAt: null,
      },
    });

    if (existingBorrow) {
      throw new BadRequestException('Book is already borrowed');
    }

    // Calculate due date (14 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    return this.prisma.borrowedBook.create({
      data: {
        bookId: borrowBookDto.bookId,
        userId: borrowBookDto.userId,
        dueDate,
      },
      include: {
        book: {
          include: {
            author: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async returnBook(id: string) {
    const borrowedBook = await this.prisma.borrowedBook.findUnique({
      where: { id },
    });

    if (!borrowedBook) {
      throw new NotFoundException('Borrowed book record not found');
    }

    if (borrowedBook.returnedAt) {
      throw new BadRequestException('Book already returned');
    }

    return this.prisma.borrowedBook.update({
      where: { id },
      data: {
        returnedAt: new Date(),
      },
      include: {
        book: {
          include: {
            author: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.borrowedBook.findMany({
      where: {
        userId,
      },
      include: {
        book: {
          include: {
            author: true,
          },
        },
      },
      orderBy: {
        borrowedAt: 'desc',
      },
    });
  }

  async findAll() {
    return this.prisma.borrowedBook.findMany({
      include: {
        book: {
          include: {
            author: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        borrowedAt: 'desc',
      },
    });
  }
}
