import * as PIXI from 'pixi.js'
import 'leaflet-pixi-overlay' // Must be called before the 'leaflet' import
import L, {LatLng, Map, Point} from 'leaflet';
import {Angebot} from "../../domain/angebot/Angebot";
import {Bedarf} from "../../domain/bedarf/Bedarf";
import {AngebotAnfrage} from "../../domain/angebot/AngebotAnfrage";
import {BedarfAnfrage} from "../../domain/bedarf/BedarfAnfrage";



let globalContainer: PIXI.Container = new PIXI.Container()
let pixiHandledEvent: boolean = false
let textures: any = {}

export const loadTextures = (callback: () => any) => {
  const loader = new PIXI.Loader();
  loader.add('markerOrange', 'marker_orange.png');
  loader.add('markerBlue', 'marker_blue.png');
  loader.load((loader, resources) => {
    textures = {blue: resources.markerBlue?.texture, orange: resources.markerOrange?.texture}
    callback()
  });
}

export const createContainer = (input: any[], mapRef: Map) => {
  const pixiContainer = new PIXI.Container();

  let spriteTexture: PIXI.Texture = textures.orange

  input.map((mapFeature: any) => {
    if (mapFeature.type == "Angebot") {
      spriteTexture = textures.blue
    }
    if(mapFeature.type == "Bedarf") {
      spriteTexture = textures.orange
    }

    const markerLatLng: number[] = [mapFeature.standort.latitude, mapFeature.standort.longitude];
    const marker: PIXI.Sprite = new PIXI.Sprite(spriteTexture);
    marker.x = markerLatLng[0];
    marker.y = markerLatLng[1];
    marker.anchor.set(0.5, 1);
    marker.interactive = true;
    marker.buttonMode = true;

    marker.on("click", (e: any) => {
      let p: Point = mapRef.latLngToLayerPoint(new LatLng(markerLatLng[0], markerLatLng[1]))
      p.y = p.y - spriteTexture.height
      let mapP: LatLng = mapRef.layerPointToLatLng(p)
      let text = '<b>ArtikelTyp: ' + mapFeature.artikelVarianteId + '</b><br>Strasse: ' + mapFeature.standort.strasse + '</br>Ort: ' + mapFeature.standort.ort
      showPopUp(mapP.lat, mapP.lng, text, mapRef)
      pixiHandledEvent = true
    })

    pixiContainer.addChild(marker);
  })
  globalContainer.addChild(pixiContainer)
}

const showPopUp = (lat: number, lon: number, text: string, mapRef: Map) => {
  L.popup({className: 'pixi-popup', autoPan: false, pane: "popupPane", closeOnClick: false})
    .setLatLng([lat, lon])
    .setContent(text)
    .openOn(mapRef);
}

export const createOverlay = (mapRef: Map) => {
  mapRef.on("click", (e: any) => {
    if (!pixiHandledEvent) {
      mapRef.closePopup()
    }
    pixiHandledEvent = false
  })

  mapRef.on("zoomstart", () => {
    mapRef.closePopup()
  })

  let firstDraw = true;
  let prevZoom: number;

  const pixiOverlay = (L as any).pixiOverlay(function (utils: any) {
    const zoom = utils.getMap().getZoom();
    const container = utils.getContainer()
    const renderer = utils.getRenderer();
    const project = utils.latLngToLayerPoint;
    const scale = utils.getScale();

    if (firstDraw) {
      for (let subContainer of container.children) {
        for (let entry of subContainer.children) {
          const markerCoords = project([entry.x, entry.y]);
          entry.x = markerCoords.x;
          entry.y = markerCoords.y;
        }
      }
    }

    if (prevZoom !== zoom) {
      for (let subContainer of container.children) {
        for (let entry of subContainer.children) {
          entry.scale.set(1 / scale);
        }
      }
    }

    firstDraw = false;
    prevZoom = zoom;
    renderer.render(container);
  }, globalContainer);
  pixiOverlay.addTo(mapRef)
}