# ISS Tracker using CesiumJS and satellite.js

This project visualizes the real-time position of the International Space Station (ISS) on a 3D globe using CesiumJS and satellite.js.  
The satellite’s position is calculated from Two-Line Element (TLE) data and updated periodically.

## Features
- Real-time ISS tracking based on TLE propagation
- 3D Earth visualization powered by CesiumJS
- Automatic position updates every 5 seconds
- Realistic globe lighting for day and night simulation

## Technologies
- [CesiumJS](https://cesium.com/platform/cesiumjs/) for 3D visualization  
- [satellite.js](https://github.com/shashwatak/satellite-js) for orbital position calculation

## How it works
1. The ISS TLE data is parsed to create a satellite record.  
2. The current position is propagated and converted from ECI to geodetic coordinates.  
3. CesiumJS displays the satellite’s location on the globe and updates it in real time.
