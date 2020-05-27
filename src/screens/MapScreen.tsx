import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootDispatch, RootState } from "../state/Store";
import Map from "../components/Map/Map";
import { loadPerson } from "../state/person/PersonState";
import katSonstiges from "../resources/kategorie_sonstiges.svg";
import katDesinfektion from "../resources/kategorie_desinfektion.svg";
import { loadAngebote } from "../state/angebot/AngeboteState";
import { loadBedarfe } from "../state/bedarf/BedarfeState";

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
  const fallbackCenter = { lat: 52.52, lng: 13.405 }; // Berlin
  const center =
    (curInst && {
      lat: curInst.latitude || fallbackCenter.lat,
      lng: curInst.longitude || fallbackCenter.lng
    }) ||
    fallbackCenter;

  const rndCoordsAroundCenter = () => ({
    lat: center.lat + Math.random() - 0.5,
    lng: center.lng + Math.random() - 0.5
  });
  const createEntity = (
    title: string,
    count: number,
    isRequest: boolean = false
  ) => ({
    ...rndCoordsAroundCenter(),
    title,
    count,
    comment: `${title} (${count})`,
    icon: isRequest ? katSonstiges : katDesinfektion
  });

  const pois = [
    // ...angebote?.map(angebot => ({
    //   lat: angebot.standort.latitude,
    //   lng: angebot.standort.longitude,
    //   title: angebot.artikel.name,
    //   count: angebot.verfuegbareAnzahl,
    //   comment: angebot.kommentar,
    //   icon: katDesinfektion
    // })),
    createEntity("Wasser 1l", 10),
    createEntity("Wasser 1l", 5),
    createEntity("Wasser 1l", 1),
    // ...bedarfe?.map(bedarf => ({
    //   lat: bedarf.standort.latitude,
    //   lng: bedarf.standort.longitude,
    //   title: bedarf.artikel.name,
    //   count: bedarf.verfuegbareAnzahl,
    //   comment: bedarf.kommentar,
    //   icon: katSonstiges
    // })),
    createEntity("Brot 1kg", 10, true),
    createEntity("Brot 1kg", 5, true),
    createEntity("Brot 1kg", 1, true)
  ];

  return (
    <>
      <Map center={center} pois={pois} />
    </>
  );
};

export default MapScreen;
