import { Express } from "express";
import { UploadedFile } from "express-fileupload";
import { existsSync } from "fs";
import { resolve } from "path";

export class API {

    public static exposeHealthService(app: Express) {
        app.get('/health', (req, res) => {
            if ((req as any).client.authorized) {
                return res.status(200).send('"Wow man!"');
            }

            //health check
            res.sendStatus(200);
        })
    }

    public static exposeUploadService(app: Express, uploadPath: string) {
        app.post('/upload/image', (req, res) => {
            console.debug("Incoming request: ");
            //console.debug(req);
            console.debug(req.files);
        
            if (!(req as any).client.authorized) {
                return res.status(401).send('Invalid client certificate authentication.');
            }
            
            try {
                if(!req.files) {
                    console.debug("No file uploaded");
                    res.status(400).send("No file uploaded");
                    return;
                }
                
                let idUser: string = req.body.userid;
                
                let avatar: UploadedFile;
                let tmpFiles = req.files.avatar;
        
                if (Array.isArray(tmpFiles)) {
                    avatar = tmpFiles[0];
                } else {
                    avatar = tmpFiles;
                }
                let filename: string = avatar.name;
                let fileExtension = filename.substring(filename.lastIndexOf("."));
        
                avatar.mv(uploadPath + idUser + fileExtension);
        
                res.send({
                    status: true,
                    message: 'File is uploaded',
                    data: {
                        filepath: uploadPath + idUser + fileExtension,
                        mimetype: avatar.mimetype,
                        size: avatar.size
                    }
                });
                
            } catch (err) {
                console.error(err);
                res.status(500).send(err);
                return;
            }
        });
    }

	public static exposeGetMedia(app: Express, uploadPath: string) {
		app.get('/get/:filename', (req, res) => {
            console.debug("Incoming request: ");
			console.debug(req.params.filename);
			const filename: string = req.params.filename;
			const file: string = uploadPath + "/" + filename; 
			console.debug("Load file: [" + file + "]");
			
			if (!existsSync(file)) {
				console.warn("File requested [" + filename + "] not found");
				res.status(404).send(filename + " not found");
				return;
			}
			
			res.sendFile(resolve(file));
		});
	}

}