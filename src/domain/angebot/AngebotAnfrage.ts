import { Institution } from "../institution/Institution";
import { InstitutionStandort } from "../institution/InstitutionStandort";

export type AngebotAnfrageStatus =
  | "ANGENOMMEN"
  | "ABGELEHNT"
  | "STORNIERT"
  | "OFFEN"
  | "MATCHED";
export interface AngebotAnfrage {
  id: string;
  institution: Institution;
  standort: InstitutionStandort;
  anzahl: number;
  kommentar: string;
  status: AngebotAnfrageStatus;
  entfernung: number;
}
