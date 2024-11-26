// model for Listing 
import { GeoPoint } from "firebase-admin/firestore";
export interface Address {
    street: string;
    city: string;
    state: string;
    zip: number;
  }
  
  export interface Image {
    uri: string;
    caption?: string;
  }
  

  export interface Geolocation {
    geohash: string;
    geopoint: GeoPoint;
  }

  
  export type Status = "active" | "upcoming" | "postponed" | "archived";
  
  export interface Listing {
    title: string;
    description: string;
    address: Address;
    dates: string[];
    startTime: string;
    endTime: string;
    images?: Image[] | null;
    categories: string[];
    subcategories: Record<string, string[]>;
    postId: string;
    generatedAt: string;
    status: Status;
    g: Geolocation;
    userId: string | null;
  }
  