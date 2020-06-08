import { InstitutionTyp } from "./Institution";

export type InstitutionRolle = "SPENDER" | "EMPFAENGER";
export type InstitutionAntragStatus = "OFFEN" | "GENEHMIGT" | "ABGELEHNT";

export interface InstitutionAntrag {
  id: string;
  name: string;
  strasse: string;
  hausnummer: string;
  plz: string;
  ort: string;
  land: string;
  webseite: string;
  rolle: InstitutionRolle;
  status: InstitutionAntragStatus;
  institutionTyp: InstitutionTyp;
}
