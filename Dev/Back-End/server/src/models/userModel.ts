// user model to be used in the /users collection in firestore, users must have this information
export interface User {
    hashUid: string;
    first: string;
    last: string;
    email: string[];
    zipcode: number;
    savedListing: string[];
    userlistings: string[];
  }
  