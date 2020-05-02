import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {angeboteSlice} from "./angebot/AngeboteState";
import {institutionAngeboteSlice} from "./angebot/InstitutionAngeboteState";
import {artikelKategorienSlice} from "./artikel/ArtikelKategorienState";
import {artikelSlice} from "./artikel/ArtikelState";
import {bedarfeSlice} from "./bedarf/BedarfeState";
import {institutionBedarfeSlice} from "./bedarf/InstitutionBedarfeState";
import {institutionAntraegeSlice} from "./institution/InstitutionAntraegeState";
import {institutionSlice} from "./institution/InstitutionState";
import {matchesSlice} from "./match/MatchesState";
import {personSlice} from "./person/PersonState";

const rootReducer = combineReducers({
    angebote: angeboteSlice.reducer,
    artikel: artikelSlice.reducer,
    artikelKategorien: artikelKategorienSlice.reducer,
    bedarfe: bedarfeSlice.reducer,
    institution: institutionSlice.reducer,
    institutionAngebote: institutionAngeboteSlice.reducer,
    institutionAntraege: institutionAntraegeSlice.reducer,
    institutionBedarfe: institutionBedarfeSlice.reducer,
    matches: matchesSlice.reducer,
    person: personSlice.reducer
});

export const ClearStore = {
    type: "Root:Clear"
};

export const store = configureStore({
    // @ts-ignore TODO
    reducer: (state: RootState, action: { type: any }) => {
        if (action === ClearStore) {
            return rootReducer(undefined, action);
        } else {
            return rootReducer(state, action);
        }
    }
});

export type RootState = ReturnType<typeof rootReducer>;
export type RootDispatch = typeof store.dispatch;