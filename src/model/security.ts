import {privateKey} from "../configuration/rsa";
import {sign, SignOptions} from "jsonwebtoken";
import {Payload} from "./payload";

export class Security {

    static generate(payload: Payload, options?: SignOptions): string {

        console.log(sign(
            payload,
            privateKey(),
            Object.assign({}, options, {
                algorithm: 'RS256',
                expiresIn: 7776000
            })
        ));

        return sign(
            payload,
            privateKey(),
            Object.assign({}, options, {
                algorithm: 'RS256',
                expiresIn: 7776000
            })
        )

    };

}
