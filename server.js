import fs from "fs";
import path from "path";


const __dirname = path.resolve();
class Logger {

    logDir = "";
    rotationIntervalDays = 1;
    logFileNamePrefix = ""
    // maxFileSize = 

    constructor(rotationIntervalDays = 1, maxFileSizeMB = 10, logFileNamePrefix = "app") {
        this.logDir = path.resolve(__dirname, 'logs');
        this.logFileNamePrefix = logFileNamePrefix;
        this.logFileExtension = '.txt';
        this.rotationIntervalDays = rotationIntervalDays;
        // this.maxFileSize = maxFileSizeMB * 1024 * 1024; 

        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    getTimestamp() {
        return new Date().toISOString();
    }

    getCurrentDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    getLogFilePath() {
        const date = this.getCurrentDate();
        return path.join(this.logDir, `${this.logFileNamePrefix}-${date}${this.logFileExtension}`);
    }

    isRotationNeededByDate() {
        const logFilePath = this.getLogFilePath();
        if (fs.existsSync(logFilePath)) {
            const stats = fs.statSync(logFilePath);
            const lastModified = new Date(stats.mtime);
            const now = new Date();
            const diffDays = Math.floor((now - lastModified) / (1000 * 60 * 60 * 24));
            return diffDays >= this.rotationIntervalDays;
        }
        return false;
    }

    // isRotationNeededBySize() {
    //     const logFilePath = this.getLogFilePath();
    //     if (fs.existsSync(logFilePath)) {
    //         const stats = fs.statSync(logFilePath);
    //         return stats.size >= this.maxFileSize;
    //     }
    //     return false;
    // }

    rotateLogIfNeeded() {
        // if (this.isRotationNeededByDate() || this.isRotationNeededBySize()) {
            if (this.isRotationNeededByDate()) {
            const logFilePath = this.getLogFilePath();
            const timestamp = new Date().toISOString().replace(/:/g, '-');
            const newFilePath = path.join(this.logDir, `${this.logFileNamePrefix}-${timestamp}${this.logFileExtension}`);
            fs.renameSync(logFilePath, newFilePath);
        }
    }

    async log(level, message) {
        try{
            this.rotateLogIfNeeded();
            const logFilePath = this.getLogFilePath();
            const timestamp = this.getTimestamp();
            const logMessage = `Date - ${timestamp}, \n Level - ${level} \n Message - ${message}\n\n`;
    
            fs.appendFile(logFilePath, logMessage, (err) => {
                if(err) throw err;
                return;
            });
        }
        catch(err)
        {
            console.log(err)
        }
    }

    info(message) {
        this.log('INFO', message);
    }

    warn(message) {
        this.log('WARN', message);
    }

    error(message) {
        this.log('ERROR', message);
    }
}

export default Logger
