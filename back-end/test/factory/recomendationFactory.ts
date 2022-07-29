import { faker } from "@faker-js/faker"
import { prisma } from "../../src/database"

const fakeRecommendation = () => {
	const recommendation = {
		name: faker.music.songName(),
		youtubeLink: "https://www.youtube.com/watch?v=FvOpPeKSf_4&list=RDFvOpPeKSf_4&start_radio=1&ab_channel=88rising"
	}

	return recommendation
} 

const createRecommendation = async () => {
	const recommendation = fakeRecommendation();

	await prisma.recommendation.create({
		data: recommendation
	})

	return recommendation
}

export default {
	createRecommendation,
	fakeRecommendation
}