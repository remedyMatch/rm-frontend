export class ArticleStock {
  constructor(
    private bestandUUID: string = '',
    private artikelKey: string = '',
    private menge: number = 0,
    private originalverpackt: boolean = false,
    private kaufdatum: string = '',
    private ablaufdatum: string = '',
    private charge: string = '',
    private standort: string = ''
  ) {}
}
