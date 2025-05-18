export interface UserPayload {
  id?: number;
  uuid?: string;
  username?: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  school?: string;
  post?: string;
  paidcash?: number;
  config?: Record<string, any> | null;
}