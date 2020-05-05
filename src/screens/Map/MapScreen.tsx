import React, {useEffect, useRef, useState} from "react";
import {Map, TileLayer} from "react-leaflet";
import {Angebot} from "../../Domain/Angebot";
import {createContainer, createOverlay, loadTextures} from "./MapRenderer";
import {Bedarf} from "../../Domain/Bedarf";

function MapScreen() {
  const [mapReady, setMapReady] = useState(false);
  const [markerTexturesLoaded, setMarkerTexturesLoaded] = useState(false);

  let one: Angebot = {
    id: "fooo",
    artikelId: "",
    standort: {
      ort: "TestOrt",
      strasse: "TestStrasse",
      latitude: 48.892970,
      longitude:  9.182571,
      land: "",
      hausnummer: "",
      plz: "",
      name: "",
      id: "12345"
    },
    anzahl: 10,
    artikelKategorieId: undefined,
    artikelVarianteId: "",
    entfernung: 12,
    haltbarkeit: "",
    institutionId: "",
    kommentar: "",
    medizinisch: true,
    originalverpackt: true,
    steril: true
  }
  let two: Bedarf = {
    id: "foo2",
    artikelId: "",
    standort: {
      ort: "TestStadt",
      strasse: "Test22Strasse",
      latitude: 48.783114,
      longitude: 9.171811,
      land: "",
      hausnummer: "",
      plz: "",
      name: "",
      id: "12345"
    },
    anzahl: 10,
    artikelKategorieId: undefined,
    artikelVarianteId: "",
    entfernung: 12,
    rest: 12,
    institutionId: "",
    kommentar: "",
    medizinisch: true,
    steril: true
  }

  const [mapFeatures, setMapFeatures] = useState<any[]>([one, two])
  const mapRef: React.RefObject<Map> = useRef<Map>(null);

  useEffect(() => {
    loadTextures(() => {
      setMarkerTexturesLoaded(true)
    })
  }, []);

  useEffect(() => {
    console.log('useEffect: start')
    if (mapRef.current !== null && mapReady && markerTexturesLoaded) {
      const map = mapRef.current.leafletElement
      console.log('useEffect: add overlay ')
      createContainer(mapFeatures, map)
      createOverlay(map)
    }
  }, [mapReady, markerTexturesLoaded]);

  return (
    <Map preferCanvas={true}
         center={[50, 9]}
         zoom={6}
         maxZoom={21}
         minZoom={1}
         zoomControl={false}
         style={{width: '100%', height: '90vh'}}
         whenReady={() => {
           setMapReady(true);
         }}
         ref={mapRef}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
    </Map>
  )
}

export default MapScreen