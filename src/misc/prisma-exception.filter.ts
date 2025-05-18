import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@Catch(PrismaClientExceptionFilter)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = 'Internal server error';

    switch (exception.code) {
      case 'P2002':
        message =
          'Unique constraint failed. A record with this value already exists.';
        break;
      case 'P2003':
        message = 'Foreign key constraint failed. Invalid reference provided.';
        break;
      case 'P2025':
        message = 'Record not found.';
        break;
      default:
        message = exception.message;
    }

    response.status(400).json({
      statusCode: 400,
      message,
    });
  }
}
