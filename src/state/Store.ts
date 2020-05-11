import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {angeboteSlice} from "./angebot/AngeboteState";
import {gestellteAngebotAnfragenSlice} from "./angebot/GestellteAngebotAnfragenState";
import {institutionAngeboteSlice} from "./angebot/InstitutionAngeboteState";
import {artikelKategorienSlice} from "./artikel/ArtikelKategorienState";
import {artikelSlice} from "./artikel/ArtikelState";
import {bedarfeSlice} from "./bedarf/BedarfeState";
import {gestellteBedarfAnfragenSlice} from "./bedarf/GestellteBedarfAnfragenState";
import {institutionBedarfeSlice} from "./bedarf/InstitutionBedarfeState";
import {benachrichtigungenSlice} from "./benachrichtigung/BenachrichtigungenState";
import {institutionAntraegeSlice} from "./institution/InstitutionAntraegeState";
import {matchesSlice} from "./match/MatchesState";
import {personSlice} from "./person/PersonState";

const rootReducer = combineReducers({
    angebote: angeboteSlice.reducer,
    artikel: artikelSlice.reducer,
    artikelKategorien: artikelKategorienSlice.reducer,
    bedarfe: bedarfeSlice.reducer,
    benachrichtigungen: benachrichtigungenSlice.reducer,
    gestellteAngebotAnfragen: gestellteAngebotAnfragenSlice.reducer,
    gestellteBedarfAnfragen: gestellteBedarfAnfragenSlice.reducer,
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