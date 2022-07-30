import { prisma } from "../database.js"

const resetDatabase =async () => {
	await prisma.$executeRaw`TRUNCATE TABLE recommendations`
}

export default resetDatabase