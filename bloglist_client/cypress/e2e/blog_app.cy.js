describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Jouko Mälkönen',
      username: 'toppahattu',
      password: 'kissa123',
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('log in to application')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('toppahattu')
      cy.get('#password').type('kissa123')
      cy.contains('login').click()
      cy.contains('Jouko Mälkönen logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('niilo22')
      cy.get('#password').type('tossaja')
      cy.contains('login').click()
      cy.contains('wrong credentials')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'toppahattu', password: 'kissa123' })
    })

    it('A blog can be created, liked and removed', function () {
      cy.contains('new blog').click()

      cy.get('.inputTitle').type('Testaus, koodaamisen lyijyisin vaihe')
      cy.get('.inputAuthor').type('Testi-Tero')
      cy.get('.inputUrl').type('www.testaansuuvaahdossa.com')
      cy.get('#blogSubmit').click()

      cy.contains('Testaus, koodaamisen lyijyisin vaihe Testi-Tero')
        .get('#showMore')
        .click()
      cy.contains('likes 0')
      cy.get('#addLikes').click()
      cy.get('.showLikes').contains('likes 1')

      cy.get('#removeBlog').click()

      cy.get('#root').should(
        'not.contain',
        'Testaus, koodaamisen lyijyisin vaihe Testi-Tero',
      )
    })

    it('For more than one blog, blogs are ordered in a descending order by amount of likes', function () {
      cy.createBlog({
        title: 'The title with the fewest likes',
        author: 'Tappio-Tomppa',
        url: 'www.kaikenlaistaharmia.fi',
      })

      cy.contains('The title with the fewest likes').parent().as('leastLiked')
      cy.get('@leastLiked').get('#showMore').click().get('#addLikes').click()

      cy.get('.showLikes').contains('likes 1')

      cy.createBlog({
        title: 'The title with the most likes',
        author: 'Voittaja-Veera',
        url: 'www.voittajanonhelppohymyilla.com',
      })

      cy.contains('The title with the most likes').parent().as('mostLiked')
      cy.get('@mostLiked').find('button').contains('view').click()
      cy.get('@mostLiked').find('button').contains('like').click()
      cy.get('@mostLiked').contains('likes 1')

      cy.get('@mostLiked').find('button').contains('like').click()
      cy.get('@mostLiked').contains('likes 2')

      cy.get('.blogContent')
        .eq(0)
        .should('contain', 'The title with the most likes')
      cy.get('.blogContent')
        .eq(1)
        .should('contain', 'The title with the fewest likes')
    })
  })
})
