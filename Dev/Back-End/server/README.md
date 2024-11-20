# API
This directory will contain the server used as the restful API that will be hosted on Render as the in between for the front-end and Firestore


## API Core Structure

### Framework
Node.js, Express, Firebase, Firestore

### Endpoints
| Description | Action | Endpoint | Query Parameters | Headers | Body | Server Actions | DB Actions | Response | Documentation Link | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |
| User views all listings | GET | /listings | lat(float) - latitude of sale lng(float) - longitude of sale radius(int) - radius in miles for distance filtering city(string) - city of sale categories(object) categories to find in sale, name and subcategories |  |  | parse parameters access db based on query retrieve public listings pagination | getDocs collection query where | Public fields of active or upcoming listings | Queries |  |
| User saves a listing | POST | /users/:userId/saved |  | Authorization: Bearer <token> (firebase-id-token) | listingId | Auth | setDoc collection where |  |  |  |
| User views their saved listings | GET | /users/:userId/saved |  | Authorization: Bearer <token> (firebase-id-token) | listingId | Auth | getDocs collection | Public fields of active or upcoming saved listings |  |  |
| User updates user info | PUT | /users/:userId |  | Authorization: Bearer <token> (firebase-id-token) | savedLocation categories subcategories | Auth | setDoc |  |  | Must set up proper auth for accessing user data |
| User deletes their account | DELETE | /users/:userId /listings/:listingId |  | Authorization: Bearer <token> (firebase-id-token) |  | retrieve userId w/ auth delete user information from firestore delete all listings made by user delete all images stored by user | ? |  |  | Must set up proper auth for accessing user data |
| User posts new listing | POST | /listings |  | Authorization: Bearer <token> (firebase-id-token) | JSON key-values:  title, description, address [street, city, state, zip], dates, startTime, images[uri, caption], categories, subcategories | Auth, generate postId, generatedAt, status, lng, lat | setDoc |  |  |  |
| User uploads image to their sale | POST | /listings/:listingId/images |  | Authorization: Bearer <token> (firebase-id-token) | base64 image, image caption | auth, upload to firebase, retrieve uri, set firestore data with image data | setDoc, firebase upload |  |  |  |
| User archives a sale | PUT | /listings/:listingId /listings/:listingId/images |  | Authorization: Bearer <token> (firebase-id-token) |  | auth, images are deleted from the firebase storage, status updated to archived | setDoc, firebase deletion |  |  |  |
| User deletes a sale | DELETE | /listings/:listingId /listings/:listingId/images |  | Authorization: Bearer <token> (firebase-id-token) |  | auth, images are deleted from the firebase storage, sale is removed from firestore | setDoc, firebase deletion |  |  |  |
| User updates/adds details to listing (text) | PUT | /listings/:listingId |  | Authorization: Bearer <token> (firebase-id-token) | fields to update |  | setDoc |  |  |  |
### Firestore
Firestore will manage our listings and user data. `server.js` will utilize the Firebase Admin SDK to interact with Firebase Storage and the Firestore Database

## Data Management
We are using a NoSQL structured schema for our data management using Firestore Database storage as our main database.

The following are structures for the anticipated documents stored:

PUB - Public field, shared with viewers
PRIV - Private field, not transferred via HTTP nor visible to users
GEN - Generated field created by server or database
USER - Provided by user input via front-end interaction
```
"listings" : [
  {
    "title": string PUB,
    "description": string PUB,
    "address" : map PUB
      {
        "street": string PUB,
        "city": string PUB,
        "state": string (abbreviation) PUB,
       "zip": number PUB,
      },
    "dates": array of strings (20241114) PUB,
    "startTime": string (07:00) PUB,
    "startTime": string (15:00) PUB,
    "images": array PUB NULLOK,
      image1: map PUB
        {
          "uri": string (uri to firebase) PUB GEN,
          "caption": string PUB
          
        },
    "categories": array PUB[
      {
        "name": string PUB
        "subcategories": string PUB NULLOK
      }
    ],
    "postId": string (uuid) GEN,
    "generatedAt": string (datetime) GEN,
    "status": string (active, upcoming, postponed, archived) PUB GEN,
    "lng": float (longitude from address) PUB GEN,
    "lat": float (latitude from address) PUB GEN,
    "userId": string (requires auth) GEN,
  }
]
```

## Security

### Authentication
Firebase Authentication is used to authenticte users, as well as Google OAuth for users to be able to sign in with their google account.

### Encryption
Certain protected information is encrypted before being sent through HTTP requests and other data transfers. The backend API can validate tokens sent from client to ensure private data is not public traffic.

### Privacy
Users will not have their information public to others, so there is not identifying data that is listed on sales. The response from the API will only include public fields that will be necessary to display the listing and filter the posts by user input.

Users will be able to archive their posts, and once a post has been archived, the image will be deleted from the database to perserve storage and ensure privacy. 

## Optimization

## Auto-Cleanup
There are several options for removing expired or archived posts from feeds, but we want to preserve a user's previous sales for their viewing. We will set up a cron service to check every 12 hours for listings that have the "active" status and change it to "archived" for the user to view later. This way expired listings are not filling up the feed. The service will run at 2am and 2pm, to keep the feed relevant and clear. 

The cron service will also remove the image stored in the firebase image storage to perserve the storage space.

Our options include using a Cloud Function with Firestore, or setting up an endpoint and using a cron service to call the endpoint. We will likely use the Cloud Function with Firestore unless issues arise. 