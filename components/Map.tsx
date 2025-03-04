import { icons, mockedDrivers } from "@/constants";
import { calculateRegion, generateMarkersFromData } from "@/libs/map";
import { useDriverStore, useLocationStore } from "@/store";
import { MarkerData } from "@/types/type";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

export default function Map() {
  const {
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();

  const { selectedDriver, setDrivers, drivers } = useDriverStore();
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });

  useEffect(() => {
    // setDrivers(mockedDrivers)
    if (Array.isArray(mockedDrivers)) {
      if (!userLatitude || !userLongitude) {
        return;
      }

      // const newMarkers = generateMarkersFromData({
      //   data: mockedDrivers,
      //   userLatitude,
      //   userLongitude,
      // });
      setMarkers(drivers);
    }
  }, [drivers]);

  // console.log(drivers)

  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      style={styles.container}
      tintColor="black"
      mapType={Platform.OS === "ios" ? "mutedStandard" : "standard"}
      showsPointsOfInterest={false}
      initialRegion={region}
      showsUserLocation
      userInterfaceStyle="light"
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          image={
            selectedDriver === marker.id ? icons.selectedMarker : icons.marker
          }
        ></Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
});
