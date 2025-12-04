import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BorrowedBooksService } from './borrowed-books.service';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('borrowed-books')
@Controller('borrowed-books')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BorrowedBooksController {
  constructor(private readonly borrowedBooksService: BorrowedBooksService) {}

  @Post()
  @ApiOperation({ summary: 'Borrow a book' })
  @ApiResponse({ status: 201, description: 'Book borrowed successfully' })
  @ApiResponse({ status: 400, description: 'Book already borrowed' })
  @ApiResponse({ status: 404, description: 'Book or user not found' })
  borrowBook(@Body() borrowBookDto: BorrowBookDto) {
    return this.borrowedBooksService.borrowBook(borrowBookDto);
  }

  @Patch(':id/return')
  @ApiOperation({ summary: 'Return a borrowed book' })
  @ApiResponse({ status: 200, description: 'Book returned successfully' })
  @ApiResponse({ status: 400, description: 'Book already returned' })
  @ApiResponse({ status: 404, description: 'Borrowed book record not found' })
  returnBook(@Param('id') id: string) {
    return this.borrowedBooksService.returnBook(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all borrowed books for a user' })
  @ApiResponse({ status: 200, description: 'Return borrowed books for user' })
  findByUser(@Param('userId') userId: string) {
    return this.borrowedBooksService.findByUser(userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all borrowed books' })
  @ApiResponse({ status: 200, description: 'Return all borrowed books' })
  findAll() {
    return this.borrowedBooksService.findAll();
  }
}
