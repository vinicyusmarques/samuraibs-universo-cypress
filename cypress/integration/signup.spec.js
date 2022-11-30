
import signupPage from '../support/pages/signup'

describe('Cadastro', function () {

    context('quando o usuário é novo', function () {
        const user = {
            name: 'Vinicyus Marques',
            email: 'vinicyusmarquess@gmail.com',
            password: 'vini123'
        }

        before(function () {
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })
        })

        it('Deve cadastrar com sucesso', () => {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')
        })
    })

    context('quando o email já existe', function () {
        const user = {
            name: 'João Paulo',
            email: 'joao@gmail.com',
            password: 'vini123',
            is_provider: true
        }

        before(function () {

            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })

            cy.request(
                'POST',
                'http://localhost:3333/users',
                user
            ).then(function (response) {
                expect(response.status).to.eq(200)
            })

        })

        it('Deve exibir email já cadastrado', () => {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Email já cadastrado para outro usuário.')
        })

    })

    context('quando o email é incorreto', function () {
        const user = {
            name: 'João Paulo',
            email: 'joao.gmail.com',
            password: 'vini123',
            is_provider: true
        }

        it('deve exibir mensagem de alerta', function () {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.alertHaveText('Informe um email válido')

        })
    })

    context('quando a senha não possui caracteres sucifiente', function () {

        const passwords = ['1', 'a2', 'ca3', '4ssq', '5cds#']

        beforeEach(() => {
            signupPage.go()
        })

        passwords.forEach(function (p) {
            it('não deve cadastrar com com a senha: ' + p, function () {
                const user = { name: 'João 1 caractere', email: 'joaopauilp@gmail.com', password: p }

                signupPage.form(user)
                signupPage.submit()
            })
        })

        afterEach(() => {
            signupPage.alertHaveText('Pelo menos 6 caracteres')
        })
    })

    context.only('quando não preencho nenhum dos campos', function () {
        const alertMessages = [
            'Nome é obrigatório',
            'E-mail é obrigatório',
            'Senha é obrigatória',
        ]

        before(function () {
            signupPage.go()
            signupPage.submit()
        })

        alertMessages.forEach(function (alert) {
            it('Deve exibir ' + alert.toLowerCase(), () => {
                signupPage.alertHaveText(alert)
            })
        })
    })
})
