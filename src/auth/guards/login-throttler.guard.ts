/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class LoginThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const email = (req.body?.email as string) || 'anonymous';
    return `login-${email}`;
  }

  protected getLimit(): Promise<number> {
    return Promise.resolve(5);
  }

  //   time to live (ttl) in milliseconds
  protected getTTL(): Promise<number> {
    return Promise.resolve(60000);
  }

  protected async throwThrottlingException(): Promise<void> {
    throw new ThrottlerException(
      'Too many login attempts. Please try again later.',
    );
  }
}
