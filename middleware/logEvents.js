import fs from "fs";
import fsPromise from "fs/promises";
import path, { format } from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from 'uuid';


const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), "yyyy-MM-dd\tHH:mm:ss")}`;
    const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    try {
        if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
            await fsPromise.mkdir(path.join(__dirname, "..", "logs"));
        }
        await fsPromise.appendFile(path.join(__dirname, "..", "logs", logName), logItem);
    } catch (error) {
        console.log(error);
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.txt")
    console.log(`${req.method} ${req.path}`);
    next()
}

export { logEvents, logger }