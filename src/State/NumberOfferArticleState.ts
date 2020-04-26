import createApiState from "./ApiState";

export interface NumberOfferArticle {
    id: string;
    articleId: string;
    amountAvailable: number;
}

const name = "NumberCategory";
const url = "/angebot/suche/filters/artikel";
const [numberOfferArticleSlice, loadNumberOfferArticle] = createApiState<NumberOfferArticle[]>(name, url);

export {
    numberOfferArticleSlice, loadNumberOfferArticle,
};