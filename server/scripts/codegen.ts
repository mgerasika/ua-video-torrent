const fs = require('fs');
const path = require('path');
import prettier from 'prettier';
import { generateSpecAsync, getSpecInfoAsync } from 'typescript-to-swagger';

getSpecInfoAsync({ dir: ['./src/controller', './src/enum', './src/dto', './src/interfaces'] }).then((res) => {
    // console.log('MODEL', JSON.stringify(res, null, 2));
});

generateSpecAsync({ dir: ['./src/controller', './src/enum', './src/dto', './src/interfaces'] }).then((res) => {
    const spec = JSON.stringify(
        {
            openapi: '3.0.1',
            info: {
                title: 'ua-video-torrent',
                description: 'service-1',
                version: '0.0.1',
            },
            ...res,
        },
        null,
        2,
    );
    fs.writeFileSync(path.resolve('../spec.json'), spec);
    console.log('generate spec file success ', '../spec.json');
});
