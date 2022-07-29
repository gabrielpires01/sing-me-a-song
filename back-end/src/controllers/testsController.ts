import { prisma } from "../database.js"

const resetDatabase =async () => {
	console.log('oiii')
	await prisma.$executeRaw`TRUNCATE TABLE recommendations`
}

export default resetDatabase