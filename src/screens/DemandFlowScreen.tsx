import React, {useCallback} from "react";
import PPEFlow from "./PPEFlow/PPEFlow";
import {Artikel} from "../domain/artikel/Artikel";
import {ArtikelVariante} from "../domain/artikel/ArtikelVariante";

const DemandFlowScreen: React.FC = () => {
    const getArticleName = useCallback((article?: Artikel, variant?: ArtikelVariante) => {
        const name = article?.name || "";
        return variant ? `${name} in Größe ${variant.variante}` : name;
    }, []);

    const getLoadingPageTitle = useCallback((selectedArticle?: Artikel, selectedVariant?: ArtikelVariante) => {
        const article = getArticleName(selectedArticle, selectedVariant);
        return `Wir suchen Angebote für ${article}...`;
    }, [getArticleName]);

    const getResultsTitle = useCallback((resultCount: number, selectedArticle?: Artikel, selectedVariant?: ArtikelVariante) => {
        const article = getArticleName(selectedArticle, selectedVariant);
        if (resultCount === 0) return `Wir haben keine Angebote für ${article} gefunden.`;
        if (resultCount === 1) return `Wir haben 1 Angebot für ${article} gefunden.`;
        return `Wir haben ${resultCount} Angebote für ${article} gefunden.`;
    }, [getArticleName]);

    const getResultsSubtitle = useCallback((resultCount: number) => {
        if (resultCount === 0) return "Sie können aber ein Inserat erstellen, damit sich Spender bei Ihnen melden können.";
        return "Sie können die gewünschten Spender kontaktieren, um sie auf Ihren Bedarf aufmerksam zu machen, oder Sie können ein Inserat erstellen, damit sich Spender bei Ihnen melden können.";
    }, []);

    return (
        <PPEFlow
            flowType="demand"
            articleCategoryPageTitle="Welches Material suchen Sie?"
            articlePageTitle="Was genau benötigen Sie?"
            articleVariantPageTitle="Welche Größe benötigen Sie?"
            getLoadArticleCountsUrl={categoryId => "/remedy/angebot/suche/filter/artikel?ohneEigene=true&artikelKategorieId=" + categoryId}
            getLoadCategoryCountsUrl={() => "/remedy/angebot/suche/filter/artikelkategorie?ohneEigene=true"}
            getLoadingPageTitle={getLoadingPageTitle}
            getLoadResultsUrl={variantId => "/remedy/angebot/suche?ohneEigene=true&artikelVarianteId=" + variantId}
            getLoadVariantCountsUrl={articleId => "/remedy/angebot/suche/filter/artikelvariante?ohneEigene=true&artikelId=" + articleId}
            getResultsPageSubtitle={getResultsSubtitle}
            getResultsPageTitle={getResultsTitle}/>
    );
};

export default DemandFlowScreen;