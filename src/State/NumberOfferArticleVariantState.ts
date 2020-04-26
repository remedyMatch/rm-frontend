import createApiState from "./ApiState";

export interface NumberOfferArticleVariant {
    id: string;
    articleId: string;
    amountAvailable: number;
}

const name = "NumberCategory";
const url = "/angebot/suche/filters/artikel";
const [numberOfferArticleVariantSlice, loadNumberOfferArticleVariant] = createApiState<NumberOfferArticleVariant[]>(name, url);

export {
    numberOfferArticleVariantSlice, loadNumberOfferArticleVariant,
};