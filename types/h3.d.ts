import type { UserPayload } from '~/types/UserPayload';

declare module 'h3' {
  interface H3EventContext {
    authUser?: UserPayload;
  }
}