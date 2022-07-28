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