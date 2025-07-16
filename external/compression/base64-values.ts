
const BASE64_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

const BASE64_VALUES = new Array<number>(123); // max char code in base64Keys

for (let i = 0; i < 123; ++i) {
    BASE64_VALUES[i] = 64; // fill with placeholder('=') index
}

for (let i = 0; i < 64; ++i) {
    BASE64_VALUES[BASE64_KEYS.charCodeAt(i)] = i;
}

export default BASE64_VALUES;
