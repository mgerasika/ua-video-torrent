/* eslint-disable @typescript-eslint/no-namespace */

// import 'cypress-file-upload';

// ***********************************************
// This commands.ts shows you how to
// create various custom commands
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Must be declared global to be detected by typescript (allows import/export)
declare global {
    namespace Cypress {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        interface Chainable<Subject> {
            /**
             * @deprecated The method should not be used
             */
            intercept(): void;

            /**
             * Custom command to successfully login
             * @example cy.login()
             */
            login(): void;

            /**
             * Custom command to successfully login mocked
             * @example cy.mockLogin()
             */
            mockLogin(): void;

            /**
             * Custom command for logging api request
             */
            logRequest(): void;
        }
    }
}

Cypress.Commands.add('login', () => {
    cy.visit('/');
    // cy.request({
    //     failOnStatusCode: false,
    //     url: 'TEST_API_URI',
    //     method: 'POST',
    //     headers: {
    //         accept: '*/*',
    //         'content-type': 'application/json',
    //     },
    //     body: `{"operationName":"login","variables":{"email":"${TEST_VALID_USER_EMAIL}","password":"${TEST_VALID_USER_PASSWORD}"},"query":"mutation login($email: String!, $password: String!) {\\n  login(email: $email, password: $password) {\\n    ...AuthResult\\n    __typename\\n  }\\n}\\n\\nfragment AuthResult on AuthenticationResult {\\n  accessToken\\n  expiresIn\\n  refreshToken\\n  __typename\\n}\\n"}`,
    // })
    //     .then((loginResponse) => {
    //         localStorage.setItem('accessToken', loginResponse.body.data.login.accessToken);
    //         localStorage.setItem('refreshToken', loginResponse.body.data.login.refreshToken);
    //         return cy.window().its('__store__');
    //     })
    //     .then((store) => {
    //         store.dispatch({ type: 'auth/logIn' });
    //         cy.visit('/');
    //     });
});

Cypress.Commands.add('logRequest', (body: { [key: string]: any }) => {
    cy.task('logWarn', JSON.stringify(body));
});

Cypress.Commands.add('mockLogin', () => {
    cy.visit('/');
    cy.window()
        .then((window) => {
            window.localStorage.setItem('accessToken', 'TEST_ACCESS_TOKEN');
            window.localStorage.setItem('refreshToken', 'TEST_REFRESH_TOKEN');
            return cy.window().its('__store__');
        })
        .then((store) => {
            store.dispatch({ type: 'auth/logIn' });
            cy.visit('/');
        });
});

// Convert this to a module instead of script (allows import/export)
export {};
