import {publicKey} from "../configuration/rsa";
import {RSA_PKCS1_PADDING} from "constants";
import {publicDecrypt} from "crypto";

export class AesAndRsaEncryptorDecryptor {

    constructor(secrets: Buffer) {
        // super(publicDecrypt(
        //     {
        //         key: publicKey(),
        //         padding: RSA_PKCS1_PADDING
        //     }, secrets
        // ).toString("base64"));
    }

}
