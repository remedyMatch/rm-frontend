import React, { useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
    GoogleMap,
    InfoWindow,
    LoadScript,
    Marker, useLoadScript
} from "@react-google-maps/api";

type GeoCoords = { lat: number; lng: number };
type Meta = { title: string; comment: string; count: number; icon: any };
type Poi = GeoCoords & Meta;

interface Props {
  center: GeoCoords;
  pois: Array<Poi>;
}

const useStyles = makeStyles((theme: Theme) => ({
  mapContainer: {
    width: "100%",
    height: "85vh",
    margin: "0 auto"
  }
}));

const Map: React.FC<Props> = ({ center, pois }) => {
  const classes = useStyles();
  const [whichInfoOpen, setWhichInfoOpen] = useState(-1);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerClassName={classes.mapContainer}
        center={center}
        zoom={9}
      >
        {pois.map((poi, index) => (
          <Marker
            key={index}
            position={poi}
            label={`${poi.title} (${poi.count})`}
            icon={poi.icon}
            onClick={() => setWhichInfoOpen(index)}
          >
            {index === whichInfoOpen && (
              <InfoWindow position={poi} onCloseClick={() => setWhichInfoOpen(-1)}>
                <div>
                  <div>{poi.title}</div>
                  <div>{poi.comment}</div>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
