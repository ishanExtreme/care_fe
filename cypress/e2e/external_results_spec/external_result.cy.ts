import { cy, describe, it, before, beforeEach, afterEach } from "local-cypress";

describe("Edit Profile Testing", () => {
  before(() => {
    cy.loginByApi("devdistrictadmin", "Coronasafe@123");
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.awaitUrl("/external_results");
  });

  it("Search by Patient name", () => {
    cy.intercept(/\/api\/v1\/external_result/).as("external_result");
    cy.get("[name='search'][placeholder='Search by Patient Name']").type(
      "akhil"
    );
    cy.wait("@external_result").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.request.url).to.include("name=akhil");
    });
    cy.url().should("include", "akhil");
  });

  it("Search by phone number", () => {
    cy.intercept(/\/api\/v1\/external_result/).as("external_result");
    cy.get("[placeholder='Search by Phone Number']").type("4738743424");
    cy.wait("@external_result").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });
    cy.url().should("include", "%2B91+47387-43424");
  });

  it("upload list", () => {
    cy.contains("Upload List").click().wait(100);
    // TODO: attach file and save
  });

  it("export", () => {
    cy.intercept("/api/v1/external_result/?csv=true").as("export");
    cy.contains("Export").click();
    cy.wait("@export").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });
});
