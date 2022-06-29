import * as express from 'express';
import * as cors from 'cors';
import * as fileUpload from 'express-fileupload';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as _ from 'lodash';
import * as  https from 'https';
import * as fs from 'fs';
import { PropertiesLoader as prop} from './properties-loader';
import { API } from './api';


const argProfile: string = prop.loadProfile();

const uploadPath: string = prop.getUploadPath();
const serverPort: Number = prop.getServerPort();

var options = { 
    key: fs.readFileSync(prop.getServerKeyPath()), 
    cert: fs.readFileSync(prop.getServerCertificatePath()), 
    requestCert: true,
    rejectUnauthorized: false,
    ca: fs.readFileSync(prop.getCACertificatePath()),
}; 

const app: express.Express = express();
app.use(cors());
app.use(fileUpload({
    createParentPath: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

if (argProfile && "dev" === argProfile)
	app.use(morgan('dev'));

https.createServer(options, app)
    .listen(serverPort, () => {
        console.log("------------------------\n" +
                    "     Server started\n" +
                    "   Express  framework\n" +
                    "     Profile: " + argProfile + "\n" +
                    "   Store path: " + uploadPath);
        console.log(new Date());
        console.log("------------------------");
        console.log("\nListening on URL\n" +
                    "https://localhost:" + serverPort);
        console.log("");
    }
);

API.exposeHealthService(app);
API.exposeUploadService(app, uploadPath);
API.exposeGetMedia(app, uploadPath);

