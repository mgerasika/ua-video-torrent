/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/// <reference types="cypress" />

// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-undef
module.exports = (on, config) => {
    // eslint-disable-next-line no-undef

    // add other tasks to be registered here
    on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium') {
            console.log('Adding Chrome flag: --disable-dev-shm-usage');
            launchOptions.args.push('--disable-dev-shm-usage');

            console.log('Adding Chrome flag: --disable-site-isolation-trials');
            launchOptions.args.push('--disable-site-isolation-trials');
        }
        return launchOptions;
    });

    on('task', {
        logWarning: (message) => {
            console.warn(message);
            return null;
        },
    });

    // IMPORTANT to return the config object
    // with the any changed environment variables
    return config;
};
