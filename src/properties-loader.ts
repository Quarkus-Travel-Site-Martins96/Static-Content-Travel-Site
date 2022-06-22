import * as minimist from 'minimist';
import { readFileSync } from 'fs';


export class PropertiesLoader {

	public static loadConfFilePath(): string {
		const args = minimist(process.argv.slice(2));
		let path: string = args['conf-file-path'];
		if (!path)
			return 'conf/dev/config.json';
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

	public static getCACertificatePath(): string {
		let caPath: string = PropertiesLoader.getConfPropery("ca-path");
		if (!caPath) {
			console.warn("Missing configuration for key 'ca-path', using default (conf/dev/ca-cert.pem)");
			return "conf/dev/ca-cert.crt";
		}
		
		return caPath;
	}

	public static getServerCertificatePath(): string {
		let caPath: string = PropertiesLoader.getConfPropery("cert-path");
		if (!caPath) {
			console.warn("Missing configuration for key 'cert-path', using default (conf/dev/server-cert.pem)");
			return "conf/dev/server-cert.pem";
		}
		
		return caPath;
	}

	public static getServerKeyPath(): string {
		let caPath: string = PropertiesLoader.getConfPropery("key-path");
		if (!caPath) {
			console.warn("Missing configuration for key 'key-path', using default (conf/dev/server-key.pem)");
			return "conf/dev/server-key.pem";
		}
		
		return caPath;
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