import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {angeboteSlice} from "./AngeboteState";
import {artikelKategorienSlice} from "./ArtikelKategorienState";
import {artikelSlice} from "./ArtikelState";
import {aufgabenSlice} from "./AufgabenState";
import {bedarfeSlice} from "./BedarfeState";
import {eigeneInstitutionSlice} from "./EigeneInstitutionState";
import {erhalteneAnfragenSlice} from "./ErhalteneAnfragenState";
import {gesendeteAnfragenSlice} from "./GesendeteAnfragenState";
import {institutionTypenSlice} from "./InstitutionTypenState";
import {matchesSlice} from "./MatchesState";

const rootReducer = combineReducers({
    angebote: angeboteSlice.reducer,
    artikel: artikelSlice.reducer,
    artikelKategorien: artikelKategorienSlice.reducer,
    aufgaben: aufgabenSlice.reducer,
    bedarfe: bedarfeSlice.reducer,
    eigeneInstitution: eigeneInstitutionSlice.reducer,
    erhalteneAnfragen: erhalteneAnfragenSlice.reducer,
    gesendeteAnfragen: gesendeteAnfragenSlice.reducer,
    institutionTypen: institutionTypenSlice.reducer,
    matches: matchesSlice.reducer
});

export const ClearStore = {
    type: "Root:Clear"
};

export const store = configureStore({
    // @ts-ignore TODO
    reducer: (state: RootState, action: { type: any }) => {
        if(action === ClearStore) {
            return rootReducer(undefined, action);
        } else {
            return rootReducer(state, action);
        }
    }
});

export type RootState = ReturnType<typeof rootReducer>;
export type RootDispatch = typeof store.dispatch;