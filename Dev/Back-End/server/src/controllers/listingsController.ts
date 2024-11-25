// Server actions for listing management
import { Request, Response } from "express";
import { getListings, postListing } from "../services/listingService";
import { Listing, Status } from "../models/listingModel";
import {
  generateCoordinatesByAddress,
  generateCoordinatesByZipcode,
  generateGeo,
} from "../services/geolocateService";


export const fetchListings = async (req: Request, res: Response) => {
  const { lat, long, radius, categories, zipcode } = req.query;
  // console.log("fetchListings called");

  try {
    let latitude: number | undefined;
    let longitude: number | undefined;

    if (!lat && !long) {
      // if no lat or long provided in request, try to use zipcode instead
      if (!zipcode) {
        // if not lat, long, or zipcode provided, listings cannot be fetched
        console.error("No location provided");
        return res.status(400).json({ error: "No location provided." });
      }

      // convert zipcode to an integer
      const zip = parseInt(zipcode as string);
      // get lat and long from geoapify using zipcode
      const coordinates = await generateCoordinatesByZipcode(zip);
      if (coordinates) {
        ({ latitude, longitude } = coordinates);
      } else {
        console.error("Failed to generate coordinates form zipcode");
        return res.status(500).json({error: "Invalid zipcode or location"})
      }
    } else {
      // if lat and long provided, convert them to integers and use them
      latitude = parseFloat(lat as string);
      longitude = parseFloat(long as string);
    }
    // declare search radius
    const searchRadius = radius ? parseInt(radius as string) : 10;

    // handle categories as json structure or as string
    let parsedCategories: string[] = [];
    if (categories) {
      try {
        parsedCategories = JSON.parse(categories as string);
      } catch (error) {
        return res.status(400).json({ error: "Invalid categories format" });
      }
    }

    

    // call query function in services with formatted filters
    const listings = await getListings({
      lat: latitude,
      long: longitude,
      radius: searchRadius,
      categories: parsedCategories,
    });
    if (!listings) {
      console.log("No listings from fetchListings");
    }
    // console.log(listings)

    res.status(200).json({ listings });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

export const createListing = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      address,
      dates,
      startTime,
      endTime,
      categories,
    } = req.body;

    if (
      !title ||
      !description ||
      !address ||
      !dates ||
      !startTime ||
      !endTime ||
      !categories
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // generate timestamp for generatedAt (format = YYYY-MM-DDTHH:mm:ss.sssZ )
    const now = new Date();
    const generatedAt = now.toISOString();

    // generate status based on the current date, sale date, and start time.
    let status: Status;
    const firstSaleDate = new Date(`${dates[0]}T${startTime}:00`);

    if (now >= firstSaleDate && now.toISOString().split("T")[0] <= dates[0]) {
      status = "active";
    } else {
      status = "upcoming";
    }

    // call api to get coordinates from address (geoapify)
    const coordinates = await generateCoordinatesByAddress(address);
    if (!coordinates) {
      throw new Error("Could not retrieve coodinates");
    }
    const { latitude, longitude } = coordinates;

    // call func to get geohash and geopoint from coordinates
    const geolocation = await generateGeo(latitude, longitude);
    if (!geolocation) {
      return res
        .status(500)
        .json({ message: "Unable to generate geolocation data." });
    }

    // insert authentication here to attach userId
    // call user auth and attach userId to listingData below:
    const listingData: Omit<Listing, "images" | "postId" | "userId"> = {
      title,
      description,
      address,
      dates,
      startTime,
      endTime,
      categories,
      generatedAt: generatedAt,
      status: status,
      g: geolocation,
    };

    const newListing = await postListing(listingData);
    return res
      .status(201)
      .json({ message: "Listing created", listing: newListing });
  } catch (err) {
    console.log("Error: ", err);
    return res
      .status(500)
      .json({ error: "Failed to create listing. Internal Server Error" });
  }
};

// export const updateListing = async (req: Request, res: Response) => {
//     const { postId } = req.params;
//     const {
//         title,
//         description,
//         address,
//         dates,
//         startTime,
//         endTime,
//         categories,
//         caption
//       } = req.body;
//       const imageFile = req.file;

//       try {
//         const listingRef = db.collection("listings").doc(postId);

//         const updateData: any = {};

//         if (title) updateData.title = title;
//         if (description) updateData.description = description;
//         if (address) updateData.address = address;
//         if (dates) updateData.dates = dates

//       }
// }
