// model for Listing 

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
  
  export interface Category {
    name: string;
    subcategories?: string;
  }
  
  export type Status = "active" | "upcoming" | "postponed" | "archived";
  
  export interface Listing {
    title: string;
    description: string;
    address: Address;
    dates: string[];
    startTime: string;
    endTime: string;
    images?: Image[];
    categories: Category[];
    postId: string;
    generatedAt: string;
    status: Status;
    lng: number;
    lat: number;
    userId: string;
  }
  