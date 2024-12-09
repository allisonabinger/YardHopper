export interface User {
    hashUid: string;
    first: string;
    last: string; 
    email: string;
    zipcode: number;
    street?: string | null;
    city?: string | null;
    state?: string | null;
    savedListings: string[];
    userListings: string[];
    createdAt: string;
  }
