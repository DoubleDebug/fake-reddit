export function log(message: string, type?: 'log' | 'error') {
    if (type)
        console[type](`%c[FR] %c${message}`, `color: orange`, `color: white`);
    else console.log(`%c[FR] %c${message}`, `color: orange`, `color: white`);
}
