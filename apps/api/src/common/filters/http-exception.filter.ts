import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common'
import { Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse() as Record<string, unknown>

    const errors = Array.isArray(exceptionResponse['message'])
      ? this.formatValidationErrors(exceptionResponse['message'] as string[])
      : undefined

    response.status(status).json({
      success: false,
      statusCode: status,
      message: errors
        ? 'Validation failed'
        : (exceptionResponse['message'] ?? exception.message),
      ...(errors && { errors }),
    })
  }

  private formatValidationErrors(messages: string[]): Record<string, string> {
    const errors: Record<string, string> = {}
    for (const msg of messages) {
      const parts = msg.split(' ')
      const field = parts[0] ?? 'unknown'
      errors[field] = parts.slice(1).join(' ')
    }
    return errors
  }
}
