import * as minimist from 'minimist';
import { readFileSync } from 'fs';


export class PropertiesLoader {

	public static loadConfFilePath(): string {
		const args = minimist(process.argv.slice(2));
		let path: string = args['conf-file-path'];
		if (!path)
			return 'conf/dev/static-content-config.json';
		return path;
	}

	public static loadProfile(): string {
		const args = minimist(process.argv.slice(2));
		let profile: string = args['profile'];
		if (!profile) {
			console.warn("Profile not defined, using PROD as default");
			return 'prod';
		}
		return profile;
	}
	
	public static getUploadPath(): string {
		const profile: string = PropertiesLoader.loadProfile();
		if (profile === 'dev')
			return "./tmp/";
		
		// profile should be prod
		let path: string = PropertiesLoader.getConfPropery("upload-path");
		if (!path) {
			console.warn("Missing configuration for key 'upload-path', using default (./tmp/)");
			return "./tmp/";
		}
		
		if (path.charAt(path.length - 1) != "/" && path.charAt(path.length - 1) != "\\") {
			path += "/";
		}

		return path;
	}
	
	public static getServerPort(): Number {
		let port: Number = PropertiesLoader.getConfPropery("server-port");
		if (!port) {
			console.warn("Missing configuration for key 'server-port', using default (5000)");
			return 5000;
		}
		if (!PropertiesLoader.isPositiveInteger(port)) {
			console.warn(port + " is not a valid number for key 'server-port', using default (5000)");
			console.warn("Please check configuration and use a valid port value");
			return 5000;
		}
		
		return port;
	}
	
	
	private static isPositiveInteger(str: any): boolean {
		if (typeof str === 'string') {
			str = Number(str);
		}

		

		if (Number.isInteger(str) && str > 0) {
			return true;
		}

		return false;
	}
	
	
	
	
	
	private static getConfPropery(key: string): any {
		const confPath: string = PropertiesLoader.loadConfFilePath();
		const rawdata: string = readFileSync(confPath, 'utf8');
		let confFile = JSON.parse(rawdata);
		return confFile[key];
	}
	
}