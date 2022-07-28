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