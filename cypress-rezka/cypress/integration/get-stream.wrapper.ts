/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IVideoInfoResult {
    en_name: string;
    year: number;
    url: string;
    translations: ITranslation[];
}

export interface ITranslation {
    resolutions: IResolutionItem[];
    translation: string;
}

export interface IResolutionItem {
    resolution: string;
    streams: string[];
}
export const getStream = async ({
    url,
    callback,
}: {
    url: string;
    callback: (outputItems: IVideoInfoResult) => void;
}): any => {
    cy.request('https://rezka.ag/templates/hdrezka/js/playerjs41.js?v=1').as('playerjs');
    cy.readFile('cypress/fixtures/fix.js').as('fix');

    cy.get('@fix').then((fix: any) => {
        cy.get('@playerjs').then((response: any) => {
            response.body = response.body.replaceAll('eval(', 'eval2(');
            response.body = fix + '\n' + response.body;
            cy.intercept('GET', '**/playerjs41*', {
                body: response.body,
            });
            cy.intercept('POST', '**/get_cdn_series/*').as('exp');

            cy.visit(url);

            let wnd = {};
            cy.window().then((win) => {
                wnd = win;
            });

            let enName = '';
            cy.get('.b-post__origtitle').then((x) => {
                enName = x.text() || '';
            });

            const tmpUrl = url.replace('.html', '');
            const year = +tmpUrl.substring(tmpUrl.length - 4);
            cy.get('#result')
                .should('be.visible')
                .then((result) => {
                    const translations: ITranslation[] = [];
                    if (!result.find('#translators-list').length) {
                        const streamStr = result.text();
                        translations.push({
                            resolutions: streamStringToObject(streamStr),
                            translation: 'default',
                        });

                        callback({
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
                                    cy.wait('@exp').then((intercept) => {
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
                .split('or')
                .map((x) => x.trim()),
        };
    });
    return res;
}
