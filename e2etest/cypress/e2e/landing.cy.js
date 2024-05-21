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

  it('should contain environment details', () => {
    cy.get('ul li').should(($p) => {
      const listLines = $p.map((i, el) => Cypress.$(el).text()).toArray()
      expect(listLines).to.have.members([
        `Environment: ${Cypress.env('ENV')}`,
        `SiteHostname: ${Cypress.env('DOMAIN')}`,
        `SiteUrl: https://${Cypress.env('DOMAIN')}/`,
      ])
    })
  })
})
