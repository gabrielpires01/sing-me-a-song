import { jest } from "@jest/globals"
import supertest from "supertest"
import app from "../../src/app.js"
import { prisma } from "../../src/database.js"
import recomendationFactory from "../factory/recomendationFactory.js"

beforeEach(async() => {
	await prisma.$executeRaw`TRUNCATE TABLE recommendations`
})

describe("Insert", () => {
	it("Create new Recomendation",async () => {
		const recommendation = recomendationFactory.fakeRecommendation()

		const res = await supertest(app).post("/recommendations").send(recommendation)
		expect(res.status).toBe(201)
	})
	it("Schema Error Creating",async () => {
		const recommendation = recomendationFactory.fakeRecommendation();

		const res = await supertest(app).post("/recommendations").send({...recommendation, youtubeLink: "tps://www.youtube.com/wat"})
		expect(res.status).toBe(422)
	})

	it("Conflict Error Creating",async () => {
		const recommendation = await recomendationFactory.createRecommendation();

		const res = await supertest(app).post("/recommendations").send(recommendation)
		expect(res.status).toBe(409)
	})
})

describe("Upvote", () => {
	it("Upvote recommendation",async () => {
		const recommendation = await recomendationFactory.createRecommendation();

		const { id } = await prisma.recommendation.findUnique({
			where: {
				name: recommendation.name
			}
		})

		const res = await supertest(app).post(`/recommendations/${id}/upvote`)
		expect(res.status).toBe(200)
	})
})



afterAll(async () => {
	await prisma.$disconnect();
})