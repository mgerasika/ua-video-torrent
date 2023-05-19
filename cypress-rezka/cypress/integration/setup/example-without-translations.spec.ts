import { getStream } from '../get-stream.wrapper';

describe('example-get-stream', () => {
    it('get-stream', () => {
        getStream({
            url: 'https://rezka.ag/films/action/24071-superekspress-2016.html',
            callback: (result) => {
                console.log('example without translations', result);
                const name = result.url.split('/').pop();
                cy.writeFile('rezka-files/' + name, result);
            },
        });
    });
});
