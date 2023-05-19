/* eslint-disable @typescript-eslint/no-explicit-any */
// const MY_ITEMS = [
//     'https://rezka.ag/cartoons/adventures/7382-ratatuy-2007.html',
//     'https://rezka.ag/cartoons/fantasy/5659-illyuzionist-2010.html',
//     'https://rezka.ag/cartoons/fiction/4538-liga-spravedlivosti-gibel-2012.html',
// ];

describe('load from server', () => {
    it('load data and write to file', () => {
        if (true) {
            cy.request('http://localhost:8004/api/rezka_movie').then((res) => {
                const hrefs = res.body.map((i) => i.href);

                cy.readFile('cypress/integration/template.wrapper.txt').then((body) => {
                    hrefs.map((href, idx) => {
                        const name = href.split('/').pop();
                        cy.writeFile(
                            `cypress/integration/temp/rezka_${name.replace('.html', '')}.spec.ts`,
                            body.replaceAll('%TEMPLATE_URL%', href).replaceAll('%TEMPLATE_TEST_NAME%', `rezka-${name}`),
                        );
                    });
                });
            });
        }
    });
});
