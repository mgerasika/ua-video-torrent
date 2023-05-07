import 'module-alias/register';
const functions = require('firebase-functions');
import * as admin from 'firebase-admin';
import { app as expressApp } from '../src/express-app';
import { dbService } from '../src/controller/db.service';
import { API_URL } from '@server/constants/api-url.constant';

admin.initializeApp();
expressApp.get('/echo', (req, res) => {
    functions.logger.log('/echo api call ');
    res.send(JSON.stringify(dbService, null, 2));
});

expressApp.get('/', (req, res) => {
    res.send('API_URL = ' + JSON.stringify(API_URL, null, 2));
});
// Define your Express routes here
export const app = functions.https.onRequest(expressApp);
