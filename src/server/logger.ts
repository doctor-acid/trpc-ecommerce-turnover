import { PathLike } from "fs"

// usable to define logging level and type
export type logType = "file" | "console" | "dev"

type colorType = "error" | "warn" | "info"

// usable to extend our implementation
type logConfigurations = {
    file : PathLike
    other : Object
}


abstract class customLogger {
    buildLine(msg:string, color: colorType, err?: Error): string{
        let stackTrace = (err? err.stack : (new Error()).stack)
        let errName = color=="error"?(err? err.name : 'Unknown error'): "NO_ERROR"
        return new Date().toISOString() + " | " + color + " | " + errName + " | " + msg + " | " + (color=="info"? "":stackTrace);
    }
    abstract log(line: string, color: colorType, err?: Error): void
}


class ConsoleLogger extends customLogger{
    log(msg: string, color: colorType, err?: Error){
        let line: string = this.buildLine(msg, color, err)
        console.log(line)
    }
}

export default class Logger{
    private logger: customLogger

    constructor(lvl: logType, config?: logConfigurations){
        switch(lvl){
            case "dev": this.logger = new ConsoleLogger(); break;
            case "file": this.logger = new ConsoleLogger(); break;
            case "console": this.logger = new ConsoleLogger(); break;
            default : this.logger = new ConsoleLogger(); break;
        }
    }
    log(msg: string){
        this.logger.log(msg, 'info')
    }
    error(msg: string, err: Error){
        this.logger.log(msg, 'error', err)
    }
    warn(msg: string, err?: Error){
        this.logger.log(msg, 'warn', err)
    }

    setLocalLogger(lvl: logType, config?: logConfigurations){
        return new Logger(lvl, config)
    }
}