import createApiState from "./ApiState";

export interface NumberOfferCategory {
    id: string;
    categoryId: string;
    amountAvailable: number;
}

const name = "NumberCategory";
const url = "/angebot/suche/filters/artikelkategorie";
const [numberOfferCategorySlice, loadNumberOfferCategory] = createApiState<any[]>(name, url);

export {
    numberOfferCategorySlice, loadNumberOfferCategory
};