export interface SpeechQuery {

    to: Date;
    from: Date;
    page: number;
    limit?: number;
    quantity: number;
    document: string;

}
