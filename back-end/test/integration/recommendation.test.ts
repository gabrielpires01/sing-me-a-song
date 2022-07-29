import supertest from "supertest"
import app from "../../src/app.js"
import resetDatabase from "../../src/controllers/testsController.js"
import { prisma } from "../../src/database.js"
import recomendationFactory from "../factory/recomendationFactory.js"

beforeEach(async() => {
	await resetDatabase()
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

		const { id } = await recomendationFactory.findRecommendation(recommendation.name)

		const res = await supertest(app).post(`/recommendations/${id}/upvote`)
		expect(res.status).toBe(200)
	})
})

describe("Downvote", () => {
	it("Downvote recommendation",async () => {
		const recommendation = await recomendationFactory.createRecommendation();

		const { id } = await recomendationFactory.findRecommendation(recommendation.name)

		const res = await supertest(app).post(`/recommendations/${id}/downvote`)
		expect(res.status).toBe(200)
	})

	it("Downvote recommendation with remove",async () => {
		const recommendation = {
			name: "test",
			youtubeLink: "https://www.youtube.com/watch?v=FvOpPeKSf_4&list=RDFvOpPeKSf_4&start_radio=1&ab_channel=88rising",
			score: -6
		}
		await prisma.recommendation.create({
			data: recommendation
		});

		const { id } = await recomendationFactory.findRecommendation(recommendation.name)

		const res = await supertest(app).post(`/recommendations/${id}/downvote`)

		const recommendationToBeNull = await recomendationFactory.findRecommendation(recommendation.name)

		expect(res.status).toBe(200)
		expect(recommendationToBeNull).toBe(null)
	})
})

describe("Random", () => {
	it("Get Random recommendations",async () => {
		await recomendationFactory.createRecommendation();
		await recomendationFactory.createRecommendation();
		await recomendationFactory.createRecommendation();

		const res = await supertest(app).get(`/recommendations/random`)
		
		expect(res.status).toBe(200)
		expect(res.body).toBeTruthy()
	})
})

describe("Get", () => {
	it("Get recommendations",async () => {
		await recomendationFactory.createRecommendation();
		await recomendationFactory.createRecommendation();
		await recomendationFactory.createRecommendation();

		const res = await supertest(app).get(`/recommendations`)
		
		expect(res.status).toBe(200)
		expect(res.body.length).toBe(3)
	})
})

describe("Get Top", () => {
	it("Get Top recommendations",async () => {
		const recommendation = {
			name: "test",
			youtubeLink: "https://www.youtube.com/watch?v=FvOpPeKSf_4&list=RDFvOpPeKSf_4&start_radio=1&ab_channel=88rising",
			score: 5
		}

		await recomendationFactory.createRecommendation();
		await prisma.recommendation.create({
			data: recommendation
		});

		const { id } = await recomendationFactory.findRecommendation(recommendation.name)

		const ammout = Math.ceil(Math.random() * 2)

		const res = await supertest(app).get(`/recommendations/top/${ammout}`)
		
		expect(res.status).toBe(200)
		expect(res.body[0]).toStrictEqual({...recommendation, id})
	})
})

describe("Get By Id", () => {
	it("Get recommendation by Id",async () => {
		const recommendation = await recomendationFactory.createRecommendation();

		const { id } = await recomendationFactory.findRecommendation(recommendation.name)

		const res = await supertest(app).get(`/recommendations/${id}`)
		
		expect(res.status).toBe(200)
		expect(res.body).toBeTruthy()
	})
})


afterAll(async () => {
	await prisma.$disconnect();
})