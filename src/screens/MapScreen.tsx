import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootDispatch, RootState } from "../state/Store";
import Map, { Poi } from "../components/Map/Map";
import { loadPerson } from "../state/person/PersonState";
import katSonstiges from "../resources/kategorie_sonstiges.svg";
import katDesinfektion from "../resources/kategorie_desinfektion.svg";
import katSchutzkleidung from "../resources/kategorie_schutzkleidung.svg";
import { loadAngebote } from "../state/angebot/AngeboteState";
import { loadBedarfe } from "../state/bedarf/BedarfeState";
import { Angebot } from "../domain/angebot/Angebot";
import { Bedarf } from "../domain/bedarf/Bedarf";
import { InstitutionStandort } from "../domain/institution/InstitutionStandort";

const fallbackCenter = { lat: 52.52, lng: 13.405 }; // Berlin

const filterOwnOffersOrNeeds = (
  offerOrNeed: Angebot | Bedarf,
  standort: InstitutionStandort | undefined
) => standort && standort.id !== offerOrNeed.standort.id;

const mapToPoi = (
  offerOrNeed: Angebot | Bedarf,
  isOffer: boolean = false
): Poi => ({
  standortId: offerOrNeed.standort.id,
  type: isOffer ? "offer" : "need",
  lat: offerOrNeed.standort.latitude,
  lng: offerOrNeed.standort.longitude,
  title: offerOrNeed.artikel.name,
  count: offerOrNeed.verfuegbareAnzahl,
  comment: offerOrNeed.kommentar,
  icon: isOffer ? katDesinfektion : katSonstiges,
});

const reduceToStandortIdDict = (
  offersOrNeeds: { [id: string]: Array<Poi> },
  current: Poi
) => {
  if (offersOrNeeds[current.standortId]) {
    offersOrNeeds[current.standortId].push(current);
  } else {
    offersOrNeeds[current.standortId] = [current];
  }
  return offersOrNeeds;
};

const reduceToStandortIdPois = (
  offersOrNeeds: Array<Poi>,
  current: Array<Poi>
) => {
  return [
    ...offersOrNeeds,
    current.length === 1
      ? current[0]
      : {
          ...current[0],
          title: "Collection",
          count: current.length,
          comment: current.reduce(
            (str, poi, currentIndex) =>
              str +
              `${poi.count}x${poi.title} (${poi.type})\n${poi.comment}${
                currentIndex === current.length - 1 ? "" : "\n\n"
              }`,
            ""
          ),
          icon: katSchutzkleidung,
        },
  ];
};

const mapToPois = (
  angebote: Angebot[] | undefined,
  bedarfe: Bedarf[] | undefined,
  standort: InstitutionStandort | undefined
) => {
  const pois: Array<Poi> = [];
  if (angebote) {
    pois.push(
      ...angebote
        .filter((angebot) => filterOwnOffersOrNeeds(angebot, standort))
        .map((angebot) => mapToPoi(angebot, true))
    );
  }
  if (bedarfe) {
    pois.push(
      ...bedarfe
        .filter((bedarf) => filterOwnOffersOrNeeds(bedarf, standort))
        .map((bedarf) => mapToPoi(bedarf))
    );
  }
  return (Object.values(
    pois.reduce(reduceToStandortIdDict, {})
  ) as Poi[][]).reduce(reduceToStandortIdPois, []);
};

const MapScreen: React.FC = () => {
  const dispatch: RootDispatch = useDispatch();

  useEffect(() => {
    dispatch(loadPerson());
    dispatch(loadBedarfe());
    dispatch(loadAngebote());
  }, [dispatch]);

  const person = useSelector((state: RootState) => state.person.value);
  const bedarfe = useSelector((state: RootState) => state.bedarfe.value);
  const angebote = useSelector((state: RootState) => state.angebote.value);

  const curInst = person?.aktuellerStandort.standort;
  const center =
    (curInst && {
      lat: curInst.latitude || fallbackCenter.lat,
      lng: curInst.longitude || fallbackCenter.lng,
    }) ||
    fallbackCenter;

  const pois = mapToPois(
    angebote,
    bedarfe,
    person?.institutionen[0].standorte[0]
  );

  return (
    <>
      <Map center={center} pois={pois} />
    </>
  );
};

export default MapScreen;
