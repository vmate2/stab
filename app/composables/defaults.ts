import { createDecipheriv, createHash } from 'crypto'
import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();


export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const phoneRegex = /^(?:\+36|06)?\s?(?:20|30|31|50|70)\s?\d{3}\s?\d{4}$/
export const nameRegex = /^[a-záéíóöőúüűA-ZÁÉÍÓÖŐÚÜŰ]+(?:[-\s][a-záéíóöőúüűA-ZÁÉÍÓÖŐÚÜŰ]+)*$/
export const passwordRegex = /^(?=.*[A-Z])(?=.*[^a-zA-Z])[a-zA-Z[^a-zA-Z]]{8,}$/;



export const validateUserData = (email: string, phone: string, name: string): boolean => {
  return emailRegex.test(email.trim()) && phoneRegex.test(phone.trim()) && nameRegex.test(name.trim())
}

export const checkToken = async (event: any) => {
  const token = event.node.req.headers['token'] || event.node.req.headers['authorization']?.split(' ')[1]
    || (() => { throw createError({ statusCode: 401, statusMessage: 'Hozzaferes megtagadva: Hianyzo token!' }) })();

  await $fetch('/api/verifyJWT', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  }) || (() => { throw createError({ statusCode: 401, statusMessage: 'Hozzaferes megtagadva: Hibas token!' }) })();

  return true;
}

