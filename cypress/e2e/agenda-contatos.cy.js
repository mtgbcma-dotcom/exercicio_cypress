describe('Agenda de contatos - CRUD', () => {
  const contato = {
    nome: 'Contato Cypress',
    email: 'cypress@teste.com',
    telefone: '31999999999'
  }

  const novoNome = 'Contato Cypress Editado'

  const preencherFormularioPrincipal = () => {
    cy.get('form').first().within(() => {
      cy.get('input').eq(0).clear().type(contato.nome)
      cy.get('input').eq(1).clear().type(contato.email)
      cy.get('input').eq(2).clear().type(contato.telefone)
      cy.contains('button', /adicionar|cadastrar|incluir/i).click()
    })
  }

  const localizarContato = (nome) => {
    return cy
      .contains(nome)
      .parents()
      .filter(':has(button)')
      .first()
  }

  beforeEach(() => {
    cy.visit('/')
  })

  it('deve incluir um contato', () => {
    preencherFormularioPrincipal()

    cy.contains(contato.nome).should('be.visible')
    cy.contains(contato.email).should('be.visible')
    cy.contains(contato.telefone).should('be.visible')
  })

  it('deve alterar um contato', () => {
    preencherFormularioPrincipal()

    localizarContato(contato.nome).within(() => {
      cy.contains('button', /editar/i).click()
    })

    localizarContato(contato.nome).within(() => {
      cy.get('input').eq(0).clear().type(novoNome)
      cy.contains('button', /salvar/i).click()
    })

    cy.contains(novoNome).should('be.visible')
    cy.contains(contato.nome).should('not.exist')
  })

  it('deve remover um contato', () => {
    preencherFormularioPrincipal()

    localizarContato(contato.nome).within(() => {
      cy.contains('button', /remover|excluir/i).click()
    })

    cy.contains(contato.nome).should('not.exist')
  })
})
