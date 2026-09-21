describe('Agenda de contatos - CRUD', () => {
  const criarContato = (tipo) => {
    const identificador = Date.now()

    return {
      nome: `Contato Cypress ${tipo} ${identificador}`,
      email: `cypress.${tipo}.${identificador}@teste.com`,
      telefone: '31999999999'
    }
  }

  const preencherFormulario = (dados) => {
    cy.get('form').first().within(() => {
      cy.get('input').eq(0).clear().type(dados.nome)
      cy.get('input').eq(1).clear().type(dados.email)
      cy.get('input').eq(2).clear().type(dados.telefone)
    })
  }

  const adicionarContato = (dados) => {
    cy.intercept('POST', '**/api/contatos').as('adicionarContato')

    preencherFormulario(dados)

    cy.get('form')
      .first()
      .within(() => {
        cy.contains('button', /adicionar|cadastrar|incluir/i).click()
      })

    cy.wait('@adicionarContato').its('response.statusCode').should('eq', 200)
    cy.contains(dados.nome).should('be.visible')
  }

  const cardDoContato = (nome) => {
    return cy.contains('.contato', nome)
  }

  beforeEach(() => {
    cy.visit('/')
    cy.get('form').should('be.visible')
  })

  it('deve incluir um contato', () => {
    const contato = criarContato('inclusao')

    adicionarContato(contato)

    cy.contains(contato.nome).should('be.visible')
    cy.contains(contato.email).should('be.visible')
    cy.contains(contato.telefone).should('be.visible')
  })

  it('deve alterar um contato', () => {
    const contato = criarContato('edicao')
    const novoNome = `Contato Alterado ${Date.now()}`

    adicionarContato(contato)

    cardDoContato(contato.nome).within(() => {
      cy.contains('button', /editar/i).click()
    })

    cy.get('form')
      .first()
      .within(() => {
        cy.get('input').eq(0).should('have.value', contato.nome)
        cy.get('input').eq(0).clear().type(novoNome)

        cy.intercept('PUT', '**/api/contatos').as('editarContato')

        cy.contains(
          'button',
          /alterar|salvar|atualizar|editar/i
        ).click()
      })

    cy.wait('@editarContato').its('response.statusCode').should('eq', 200)

    cy.contains(novoNome).should('be.visible')
    cy.contains(contato.nome).should('not.exist')
  })

  it('deve remover um contato', () => {
    const contato = criarContato('remocao')

    adicionarContato(contato)

    cy.intercept('DELETE', '**/api/contatos').as('removerContato')

    cardDoContato(contato.nome).within(() => {
      cy.contains(
        'button',
        /deletar|remover|excluir|apagar/i
      ).click()
    })

    cy.wait('@removerContato').its('response.statusCode').should('eq', 200)

    cy.contains(contato.nome).should('not.exist')
  })
})
