import 'module-alias/register';
import { dbService } from './src/controller/db.service';
import { app } from './src/express-app';
import { typeOrmAsync } from './src/utils/type-orm-async.util';

app.get('/', (req, res) => {
    res.send(JSON.stringify(dbService, null, 2));
});

if (process.env.NODE_ENV === 'development') {
    // sync database
    typeOrmAsync(() => Promise.resolve());
}

const port = process.env.PORT || 8004;
app.listen(port, function () {
    console.log('Listening on port ' + port);
});
