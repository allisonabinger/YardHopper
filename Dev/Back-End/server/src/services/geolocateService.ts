import ngeohash from "ngeohash";
import { GeoPoint } from "firebase-admin/firestore";
import { error } from "console";
import { Address } from "../models/listingModel";
import { ENV } from "../config/environment";
import axios from "axios";
import { BadRequestError, InternalServerError } from "../middlewares/errors";

// dotenv.config({ path: path.resolve(__dirname, ".env") });
const apiKey = ENV.GEOAPIFY_API_KEY;

export const generateGeo = (latitude: number, longitude: number) => {
    try {
        if (!latitude || !longitude || typeof latitude !== "number" || typeof longitude !== "number") {
            throw new InternalServerError("Error retrieving geolocation information from coordinates.");
        }
        const geohash = ngeohash.encode(latitude, longitude);
        if (!geohash) {
            throw new InternalServerError("Error retrieving geohash.");
        }

        const geopoint = new GeoPoint(latitude, longitude);
        if (!geopoint) {
            throw new InternalServerError("Error retrieving geopoint.");
        }

        return { geohash, geopoint };
    } catch (err) {
        if (!(err instanceof InternalServerError)) {
            throw new InternalServerError("An unexpected error occurred while retrieving geolocation information from coordinates.");
        }
        throw err;
    }
};

export async function generateCoordinatesByAddress(
    address: Address
): Promise<{ latitude: number; longitude: number } | null> {
    const { street, city, state, zip } = address;

    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        street
    )}&postcode=${zip}&city=${encodeURIComponent(city)}&state=${encodeURIComponent(
        state
    )}&country=United%20States%20of%20America&lang=en&limit=5&format=json&apiKey=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (!response) {
            throw new InternalServerError("Error retrieving coordinates from address - no response from Geoapify.");
        }

        const result = response.data.results[0];
        
        if (result) {
            const latitude = result.lat;
            const longitude = result.lon;
            return { latitude, longitude };
        } else {
            throw new InternalServerError("Error retrieving coordinates from address - no results from Geoapify response.");
        }
    } catch (err) {
        if (!(err instanceof InternalServerError)) {
            throw new InternalServerError("An unexpected error occurred while retrieving geolocation information from address.");
        }
        throw err;
    }
}

export async function generateCoordinatesByZipcode(
    zipcode: number
): Promise<{ latitude: number; longitude: number } | null> {
    const url = `https://api.geoapify.com/v1/geocode/search?text=${zipcode}&type=postcode&filter=countrycode:us&apiKey=${apiKey}`;
    try {
        const response = await axios.get(url);
        if (!response) {
            throw new InternalServerError("Error retrieving coordinates from zipcode - no response from Geoapify.");
        }
        const result = response.data;

        // access result from geoapify, nested in geometry.coordinates
        if (result?.features?.length > 0) {
            const coordinates = result.features[0].geometry.coordinates;
            const longitude = coordinates[0];
            const latitude = coordinates[1];

            return { latitude, longitude };
        } else {
            throw new InternalServerError("Error retrieving coordinates from zipcode - no results from Geoapify response.");
        }
    } catch (err) {
        if (!(err instanceof InternalServerError)) {
            throw new InternalServerError("An unexpected error occurred while retrieving geolocation information from address.");
        }
        throw err;
    }
}
