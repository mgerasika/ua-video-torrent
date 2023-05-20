import { getStream } from './get-stream.wrapper';

describe('get-imdb', () => {
    it('get-imdb-rate', () => {
        const url = Cypress.env('URL');
        cy.log('ENV', url);
        cy.visit(url);
        cy.get('.b-post__info_rates imdb').should('be.visible').find('a').click();
        cy.url().should('include', 'https://www.imdb.com/');
        cy.url().then((url) => {
            throw url;
        });
    });
});
