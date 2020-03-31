import {InstitutionStandort} from "./InstitutionStandort";

export interface Institution {
    id: string;
    institutionKey: string;
    name: string;
    typ: string;
    hauptstandort?: InstitutionStandort;
    standorte: InstitutionStandort[];
}