import { getStream } from './get-stream.wrapper';

describe('example-get-stream', () => {
    it('get-stream', () => {
        const url = Cypress.env('URL');
        cy.log('ENV', url);
        getStream({
            url: url,
            callback: (result) => {
                console.log('example without translations', result);
                const name = result.url.split('/').pop();
                // cy.writeFile('rezka-files/' + name, result);

                throw JSON.stringify(result);
            },
        });
    });
});
