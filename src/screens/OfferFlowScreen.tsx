import React, {useCallback, useState} from "react";
import PPEFlow from "../components/Flow/PPEFlow";
import {Artikel} from "../domain/artikel/Artikel";
import {ArtikelVariante} from "../domain/artikel/ArtikelVariante";
import CreateOfferDialog from "./OfferFlowScreen/CreateOfferDialog";

const OfferFlowScreen: React.FC = () => {
    const [dialogVariantId, setDialogVariantId] = useState("");
    const [createOfferDialogOpen, setCreateOfferDialogOpen] = useState(false);

    const openDialog = useCallback((variantId: string) => {
        setDialogVariantId(variantId);
        setCreateOfferDialogOpen(true);
    }, []);
    const closeDialog = useCallback(() => {
        setDialogVariantId("");
        setCreateOfferDialogOpen(false);
    }, []);

    const getArticleName = useCallback((article?: Artikel, variant?: ArtikelVariante) => {
        const name = article?.name || "";
        return variant ? `${name} in Größe ${variant.variante}` : name;
    }, []);

    const getLoadingPageTitle = useCallback((selectedArticle?: Artikel, selectedVariant?: ArtikelVariante) => {
        const article = getArticleName(selectedArticle, selectedVariant);
        return `Wir suchen Bedarfe für ${article}...`;
    }, [getArticleName]);

    const getResultsTitle = useCallback((resultCount: number, selectedArticle?: Artikel, selectedVariant?: ArtikelVariante) => {
        const article = getArticleName(selectedArticle, selectedVariant);
        if (resultCount === 0) return `Wir haben keine Bedarfe für ${article} gefunden.`;
        if (resultCount === 1) return `Wir haben 1 Bedarf für ${article} gefunden.`;
        return `Wir haben ${resultCount} Bedarfe für ${article} gefunden.`;
    }, [getArticleName]);

    const getResultsSubtitle = useCallback((resultCount: number) => {
        if (resultCount === 0) return "Sie können aber ein Inserat erstellen, damit sich Empfänger bei Ihnen melden können.";
        return "Sie können die gewünschten Empfänger kontaktieren, um Ihre Artikel anzubieten, oder Sie können ein Inserat erstellen, damit sich Empfänger bei Ihnen melden können.";
    }, []);

    return (
        <>
            <PPEFlow
                flowType="offer"
                articleCategoryPageTitle="Über welches Material verfügen Sie?"
                articlePageTitle="Um was handelt es sich genau?"
                articleVariantPageTitle="Um welche Größe handelt es sich?"
                getLoadArticleCountsUrl={categoryId => "/remedy/bedarf/suche/filter/artikel?artikelKategorieId=" + categoryId}
                getLoadCategoryCountsUrl={() => "/remedy/bedarf/suche/filter/artikelkategorie"}
                getLoadingPageTitle={getLoadingPageTitle}
                getLoadResultsUrl={variantId => "/remedy/bedarf/suche?artikelVarianteId=" + variantId}
                getLoadVariantCountsUrl={articleId => "/remedy/bedarf/suche/filter/artikelvariante?artikelId=" + articleId}
                getResultsPageSubtitle={getResultsSubtitle}
                getResultsPageTitle={getResultsTitle}
                onCreateAdActionClicked={openDialog}/>

            <CreateOfferDialog
                variantId={dialogVariantId}
                open={createOfferDialogOpen}
                onCancelled={closeDialog}
                onCreated={closeDialog}/>
        </>
    );
};

export default OfferFlowScreen;