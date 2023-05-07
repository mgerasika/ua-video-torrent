import serverless from 'serverless-http';
import { app } from '../express-app';
import { dbService } from '../controller/db.service';
import { API_URL } from '@server/constants/api-url.constant';

app.get('/echo', (req, res) => {
    res.send('echo ');
});

console.log('load all express apis', dbService);

app.get('/', (req, res) => {
    res.send('/' + JSON.stringify(API_URL, null, 2));
});

export const handler = serverless(app);
