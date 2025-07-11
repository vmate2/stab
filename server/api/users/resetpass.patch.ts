import { constants } from "buffer";
import { checkToken } from "~/composables/defaults"
import { PrismaClient } from "@prisma/client";

const p = new PrismaClient()

export default defineEventHandler(async (event) => {
  await checkToken(event) || (() => {throw createError({statusCode: 401, statusMessage: 'Hibas token!'})})();
  const body = await readBody(event);
  const encryptedPass = await $fetch('/api/encrypt-password', {
    method: 'POST',
    headers: { key: useRuntimeConfig().secret_header },
    body: {
      id: body.uuid,
      password: body.password
    }
  });
  if (!encryptedPass.hashedpass) {
    throw createError({statusCode: 500, statusMessage: 'Hiba a jelszo titkositasa közben!'})
  }

  return await p.users.update({
    where: {
      uuid: body.uuid
    },
    data: {
      password: encryptedPass.hashedpass
    },
    select: {
      password: true
    }
  })

})
