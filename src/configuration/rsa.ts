import {readFileSync} from "fs";

let keys: any;

module.exports = function () {
    return (options: { privateKey: string, publicKey: string }) => {
        return keys = {
            privateKey: readFileSync(options.privateKey),
            publicKey: readFileSync(options.publicKey)
        };
    };
};

module.exports.privateKey = function () {
    return privateKey();
};

module.exports.publicKey = function () {
    return publicKey();
};

export function privateKey() {
    return keys.privateKey;
}

export function publicKey() {
    return keys.publicKey;
}
