import { createHash, createDecipheriv } from "crypto"

export default defineEventHandler(async (event) => {
  return 'Hello Nitro'
})


function decrypt(payload: string): object | null {
  const { iv, data } = JSON.parse(payload)

  const key = createHash('sha256')
    .update(useRuntimeConfig().qrSecret)
    .digest()

  const decipher = createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'base64'))
  let decrypted = decipher.update(data, 'base64', 'utf8')
  decrypted += decipher.final('utf8')
  return JSON.parse(decrypted)
}

//console.log(decrypt('{"iv":"MaTPOPZiBRftjmZ4WjNJ+w==","data":"GViSAwWIR+Mw9O7PEKa4h53IMR71HoaS6RAR/1jUF8UgemSW9fKNpt4nNfrZJVpbs5C7I/zoogT+DTnTIvr1P0szaz6xvVRsMFRp3T4TKs0p2UMeL3IkJatcW1eGlLkS"}'));
 