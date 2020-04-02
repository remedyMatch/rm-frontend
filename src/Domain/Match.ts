import {Institution} from "./Institution";
import {MatchStandort} from "./MatchStandort";

export interface Match {
    id: string;
    institutionVon: Institution;
    standortVon: MatchStandort;
    standortAn: MatchStandort;
    institutionAn: Institution;
    anfrageId: string;
    status: "Offen" | "Ausgeliefert";
    prozessInstanzId: string;
    entfernung: number;
}