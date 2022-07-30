/* eslint-disable no-undef */
/// <reference types="cypress" />

import { faker } from "@faker-js/faker"

describe("Create Recommendation", () => {
	it("should create recommendation", () => {
		const recommendation = {
			name: faker.music.songName(),
			youtubeLink: "https://www.youtube.com/watch?v=FvOpPeKSf_4&list=RDFvOpPeKSf_4&start_radio=1&ab_channel=88rising"
		}

		const recommendation2 = {
			name: faker.music.songName(),
			youtubeLink: "https://www.youtube.com/watch?v=uQFVqltOXRg&ab_channel=DanielCaesar"
		}

		cy.intercept("POST", "/recommendations").as("addRecommendation")

		cy.visit("http://localhost:3000/")
		cy.get("[data-cy='name']").type(recommendation.name)
		cy.get("[data-cy='link']").type(recommendation.youtubeLink)

		cy.intercept("GET", "/recommendations*").as("getRecommendation")

		cy.get("[data-cy='submit']").click()

		cy.contains(`${recommendation.name}`).should("be.visible")
		cy.wait("@addRecommendation")
		cy.wait("@getRecommendation")

		cy.wait(5000) 
		cy.get("[data-cy='upvote']").dblclick().dblclick()
		cy.wait(1000)

		cy.get("[data-cy='name']").type(recommendation2.name)
		cy.get("[data-cy='link']").type(recommendation2.youtubeLink)

		cy.get("[data-cy='submit']").click()
		
		cy.wait("@addRecommendation")
		cy.wait("@getRecommendation")
		cy.contains(`${recommendation2.name}`).should("be.visible")

		cy.get("[data-cy='upvote']:first").click()

		cy.wait(1000)

		cy.get("[data-cy='top']").click()
		cy.wait(3000)

		cy.get("[data-cy='random']").click()
		cy.wait(1000) 
		cy.get("[data-cy='downvote']").click().click()
	})
})