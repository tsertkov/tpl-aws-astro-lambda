describe('tpl-aws-website landing', () => {
  beforeEach(() => {
    cy.visit(
      '/',
      Cypress.env('BASIC_AUTH')
        ? {
            auth: {
              username: Cypress.env('BASIC_AUTH_USERNAME'),
              password: Cypress.env('BASIC_AUTH_PASSWORD'),
            },
          }
        : {},
    )
  })

  it('should have the header', () => {
    cy.get('h1').should('contain', 'tpl-aws-astro')
  })

  it('should contain server vars', () => {
    cy.get('#server-vars li').should(($p) => {
      const listLines = $p.map((i, el) => Cypress.$(el).text()).toArray()
      expect(listLines).to.include.members([
        `Environment: ${Cypress.env('ENV')}`,
        `SiteHostname: ${Cypress.env('DOMAIN')}`,
        `SiteUrl: https://${Cypress.env('DOMAIN')}/`,
      ])
    })
  })
})
