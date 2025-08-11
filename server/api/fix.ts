import { PrismaClient } from "@prisma/client"

const p = new PrismaClient()

export default defineEventHandler(async (event) => {
})

const xd = async() => {
  const data = await p.szponzorok.updateMany({
    where: {email: {not: null}, sentFirstLetter: false},
    data: { sentFirstLetter: true}
  })
  console.log(data);
  return 'success'
}

//xd().then(res => {
//  console.log(res);
//  
//})


  