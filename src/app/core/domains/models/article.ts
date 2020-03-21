export class Article {
  key: string;
  kategorieKey: string;
  ean: string;
  pzn: string;
  barcode: string;
  name: string;
  beschreibung: string;
  hersteller: string;
  bild: string;

  constructor(key?: string, kategorieKey?: string, ean?: string, pzn?: string, barcode?: string,
              name?: string, beschreibung?: string, hersteller?: string, bild?: string) {
    this.key = key || '';
    this.kategorieKey = kategorieKey || '';
    this.ean = ean || '';
    this.pzn = pzn || '';
    this.barcode = barcode || '';
    this.name = name || '';
    this.beschreibung = beschreibung || '';
    this.hersteller = hersteller || '';
    this.bild = bild || '';
  }
}
