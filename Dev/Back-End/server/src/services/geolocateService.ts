import ngeohash from "ngeohash";
import { GeoPoint } from "firebase-admin/firestore";
import { error } from "console";
import { Address } from "../models/listingModel";
import * as dotenv from "dotenv"
import path from "path";
import axios from "axios";

dotenv.config({ path: path.resolve(__dirname, ".env") });

export const generateGeo = (latitude: number, longitude: number) => {
  try {
    if (!latitude || !longitude) {
      console.error("Invalid latitude of longitude");
      throw error;
    }
    const geohash = ngeohash.encode(latitude, longitude);
    const geopoint = new GeoPoint(latitude, longitude);

    return { geohash, geopoint };
  } catch (error) {
    console.error("Error generating GeoPoint and GeoHash: ", error);
  }
};

export async function generateCoordinates(address: Address): Promise<{ latitude: number, longitude: number } | null> {
    const {street, city, state, zip} = address;

    const apiKey = process.env.GEOAPIFY_API_KEY;
    const url = `https://api.geoapify.com/v1/geocode/search?housenumber=&street=${encodeURIComponent(street)}&postcode=${zip}&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&country=United%20States%20of%20America&lang=en&limit=5&format=json&apiKey=${apiKey}`

    // console.log(url)
    try {
        const response = await axios.get(url);
        
        const result = response.data.results[0];

        if (result) {
            const latitude = result.lat;
            const longitude = result.lon;
            return {latitude, longitude}
        } else {
            console.error("No results found from address");
            return null;
        }
    } catch (err) {
        console.error('Error fetching coordinates: ', err)
        return null;
    }
}
// const addressTest: Address = {
//     street: "15 N Cheyenne Ave",
//     city: "Tulsa",
//     state: "OK",
//     zip: 74103
// }
// generateCoordinates(addressTest)
