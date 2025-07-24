// we import CesiumJS for the 3D globe
import * as Cesium from "cesium";
// and satellite.js for calculating satellite position from TLE data
import * as satellite from "satellite.js";

// this is the TLE data for the ISS, taken from an official source
// it's 2 lines, that's what TLE means: "Two-Line Element"
const TLE_LINE_1 = "1 25544U 98067A   21122.75616700  .00027980  00000-0  51432-3 0  9994";
const TLE_LINE_2 = "2 25544  51.6442 207.4449 0002769 310.1189 193.6568 15.48993527281553";

// here we create a satellite object using the TLE data
// this object will help us calculate the current position of the ISS
const satrec = satellite.twoline2satrec(TLE_LINE_1, TLE_LINE_2);

// now we create the Cesium viewer, which gives us the 3D earth view
const viewer = new Cesium.Viewer("cesiumContainer", {
  imageryProvider: new Cesium.TileMapServiceImageryProvider({
    url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"),
  }),
  baseLayerPicker: false,
  geocoder: false,
  homeButton: false,
  infoBox: false,
  navigationHelpButton: false,
  sceneModePicker: false,
});

// we enable lighting on the globe to make it look more realistic
viewer.scene.globe.enableLighting = true;

// this adds a red dot on the globe to show where the ISS is
// right now we just give it a fake position; we'll update it later
const issEntity = viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(0, 0, 400000), // 400km above earth
  point: {
    pixelSize: 7,
    color: Cesium.Color.RED,
  },
  label: {
    text: "ISS (TLE)",
    font: "14px sans-serif",
    fillColor: Cesium.Color.WHITE,
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    outlineWidth: 2,
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    pixelOffset: new Cesium.Cartesian2(0, -15),
  },
});

// this makes the camera follow the red dot (ISS)
viewer.trackedEntity = issEntity;

// this function gets the current ISS position from the TLE using satellite.js
function updateISSPosition(): void {
  const now = new Date();

  // satellite.js gives us ECI (earth-centered inertial) coordinates
  const posVel = satellite.propagate(satrec, now);

  // we need the GMST (greenwich mean sidereal time) to convert ECI to geodetic (lat/lon)
  const gmst = satellite.gstime(now);

  if (!posVel.position) return;

  // convert ECI position to latitude, longitude, altitude
  const positionGd = satellite.eciToGeodetic(posVel.position, gmst);

  const longitude = positionGd.longitude;
  const latitude = positionGd.latitude;
  const height = positionGd.height * 1000; // height in meters, not km

  // convert lat/lon/alt to Cesium Cartesian3 so Cesium can show it
  const cartesianPosition = Cesium.Cartesian3.fromRadians(
    longitude,
    latitude,
    height
  );

  // update the position of our red dot
  issEntity.position = new Cesium.ConstantPositionProperty(cartesianPosition);
}

// we call the function once right now to place the ISS on the globe
updateISSPosition();

// then we update it every 5 seconds so it keeps moving
setInterval(updateISSPosition, 5000);
