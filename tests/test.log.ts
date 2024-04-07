const logEnabled = false;

export function log(message?: any, ...optionalParams: any[]): void {
    if (logEnabled) {
        console.log('111')
        console.log(message, ...optionalParams);
    }
}