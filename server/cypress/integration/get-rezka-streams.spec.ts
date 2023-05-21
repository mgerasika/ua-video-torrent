import {
    IResolutionItem,
    ITranslation,
    IVideoInfoResult,
} from '../../src/controller/cypress/get-cypress-rezka-streams.controller';

describe('get-rezka-stream', () => {
    it('get-stream', () => {
        const url = Cypress.env('URL') || 'https://rezka.ag/cartoons/action/11952-angry-birds-v-kino-2016.html';
        cy.log('ENV', url);
        getStreams({
            url: url,
            callback: (result) => {
                const name = result.url.split('/').pop();
                // cy.writeFile('rezka-files/' + name, result);

                console.log('result', result);
                cy.log('result', result);
                if (Cypress.env('URL')) {
                    throw JSON.stringify(result);
                }
            },
        });
    });
});

const getStreams = async ({ url, callback }: { url: string; callback: (outputItems: IVideoInfoResult) => void }) => {
    cy.request('https://rezka.ag/templates/hdrezka/js/playerjs41.js?v=1').as('playerjs');
    cy.readFile('cypress/fixtures/fix.js').as('fix');

    cy.get('@fix').then((fix: any) => {
        cy.get('@playerjs').then((response: any) => {
            response.body = response.body.replaceAll('eval(', 'eval2(');
            response.body = fix + '\n' + response.body;
            cy.intercept('GET', '**/playerjs41*', {
                body: response.body,
            });
            cy.intercept('POST', '**/get_cdn_series/*').as('get_cdn_series');

            cy.visit(url);
            cy.url().should('include', url);

            let wnd: any = {};
            cy.window().then((win) => {
                wnd = win;
            });

            let enName = '';
            cy.get('.b-post__origtitle').then((x) => {
                enName = x.text() || '';
            });

            let imdb_id = '';
            cy.get('.b-post__info_rates')
                .find('a')
                .then((x) => {
                    imdb_id = x.attr('href') || '';
                });

            const tmpUrl = url.replace('.html', '');
            const year = +tmpUrl.substring(tmpUrl.length - 4);
            cy.get('#result')
                .should('be.visible')
                .then((result) => {
                    const translations: ITranslation[] = [];
                    if (!wnd.o._translatorsList) {
                        const streamStr = result.text();
                        translations.push({
                            resolutions: streamStringToObject(streamStr),
                            translation: 'default',
                        });

                        callback({
                            imdb_rezka_relative_link: imdb_id,
                            url,
                            en_name: enName,
                            year,
                            translations,
                        });
                    } else {
                        cy.get('#translators-list')
                            .should('be.visible')
                            .find('li')
                            .each((li, index) => {
                                if (index == 0) {
                                    const streamStr = result.text();
                                    translations.push({
                                        resolutions: streamStringToObject(streamStr),
                                        translation: li.text(),
                                    });
                                    return;
                                } else {
                                    cy.wrap(li).click();
                                    cy.wait('@get_cdn_series').then((intercept) => {
                                        const obj = JSON.parse(intercept?.response?.body);
                                        const streamStr = (wnd as any).o.FGeRtNzK(obj.url);
                                        translations.push({
                                            resolutions: streamStringToObject(streamStr),
                                            translation: li.text().trim(),
                                        });
                                    });
                                }
                            })
                            .then(() => {
                                callback({
                                    imdb_rezka_relative_link: imdb_id,
                                    url,
                                    en_name: enName,
                                    year,
                                    translations,
                                });
                            });
                    }
                });
        });
    });
};

function streamStringToObject(str: string): IResolutionItem[] {
    const res = str.split(',').map((row) => {
        const idx = row.indexOf(']');
        return {
            resolution: row
                .substring(0, idx + 1)
                .replace(/[\[\] ]/g, '')
                .replace('1080pUltra', '1280p'),
            streams: row
                .substring(idx + 1)
                .split(' or ')
                .map((x) => x.trim()),
        };
    });
    return res;
}
