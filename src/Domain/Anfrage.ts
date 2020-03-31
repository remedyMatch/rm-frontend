import {Institution} from "./Institution";

export interface Anfrage {
    id: string;
    kommentar: string;
    prozessInstanzId: string;
    institutionVon: Institution;
    institutionAn: Institution;
    bedarfId?: string;
    angebotId?: string;
    standortVon: string;
    standortAn: string;
    storniert: boolean;
    angenommen: boolean;
}