// user model to be used in the /users collection in firestore, users must have this information


export interface User {
    hashUid: string;
    first: string;
    last: Address;
    email: string[];
    zipcode: number;
    savedListing: string[];
    images?: Image[] | null;
    categories: string[];
    subcategories: Record<string, string[]>;
    postId: string;
    generatedAt: string;
    status: Status;
    g: Geolocation;
    userId: string | null;
  }
  