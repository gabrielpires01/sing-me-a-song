import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js";
import {jest} from '@jest/globals';

const teste = {
	id: 1,
	name: 'teste',
	youtubeLink: 'youtube.com/teste',
	score: 0,
}

describe("Insert" , () => {
	it("If recomendation already exists" , async () => {
		jest.spyOn(recommendationRepository, "findByName")
			.mockResolvedValueOnce(teste)

		await recommendationService
			.insert({name: teste.name, youtubeLink: teste.youtubeLink})
			.catch(err => expect(err.type).toBe("conflict"))
	})

	it("If insert succeed" , async () => {
		jest.spyOn(recommendationRepository, "findByName")
			.mockResolvedValueOnce(undefined)
		jest.spyOn(recommendationRepository, "create")
			.mockResolvedValueOnce(undefined)
		
		await recommendationService.insert({name: teste.name, youtubeLink: teste.youtubeLink})

		expect(recommendationRepository.create).toHaveBeenCalled()
	})
		
})

describe("GetIdOrFail" , () => {
	it("If recomendation not found" , async () => {
		jest.spyOn(recommendationRepository, "find")
			.mockResolvedValueOnce(null)
			
		await recommendationService.getById(1)
			.catch(err => expect(err.type).toBe("not_found"))
	})
	it("If recomendation exists" , async () => {
		jest.spyOn(recommendationRepository, "find")
			.mockResolvedValueOnce(teste)
			
		const result = await recommendationService.getById(1)

		expect(result).toBe(teste)
	})
})

describe("Get Random" , () => {
	it("No Recomendations" , async () => {
		jest.spyOn(recommendationRepository, "findAll")
			.mockResolvedValueOnce([])
			.mockResolvedValueOnce([])
		
		await recommendationService.getRandom()
			.catch(err => expect(err.type).toBe("not_found"))
	})

	it("with Recomendations where dont get any by filter" , async () => {
		jest.spyOn(recommendationRepository, "findAll")
			.mockResolvedValueOnce([])
			.mockResolvedValueOnce([{...teste, score:10},teste,teste])
		
		const result = await recommendationService.getRandom()
		
		expect(result).toBeTruthy()
	})

	it("with Recomendations gotten by filter" , async () => {
		jest.spyOn(recommendationRepository, "findAll")
			.mockResolvedValueOnce([{...teste, score:10},teste,teste])
		
		const result = await recommendationService.getRandom()
		
		expect(result).toBeTruthy()
	})
		
})

describe("Get Score Filter" , () => {
	it("Random < 0.7" , async () => {
		const result = recommendationService.getScoreFilter(0.5)

		expect(result).toBe("gt")
	})

	it("Random >= 0.7" , async () => {
		const result = recommendationService.getScoreFilter(0.9)

		expect(result).toBe("lte")
	})
		
})