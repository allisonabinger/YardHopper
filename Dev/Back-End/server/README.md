# API
This directory will contain the server used as the restful API that will be hosted on Render as the in between for the front-end and Firestore

## Usage
This server will be hosted on a service to manage incoming and outgoing traffic and database operations. The Firestore database is set up with mock data that should be identical to the data used in production.

These are the instructions for running the server locally before any hosting and security is completed. 

**You must have an .env set up before this server will properly function. Please contact database admin for .env keys.**

At this point, the API has two working endpoints: `GET /listings` and `POST /listings`. User auth and functionality has not been implemented.

### Starting the server. 

In your terminal, run `npm run dev` from the /server directory. 
```
$ npm run dev

> yardhopper-server@1.0.0 dev
> ts-node-dev src/server.ts

[INFO] 14:22:19 ts-node-dev ver. 2.0.0 (using ts-node ver. 10.9.2, typescript ver. 5.6.3)
```

Using Postman, your browser, or `curl`, you can now utilize the endpoints. 

### GET /listings
The `GET /listings` endpoint will need accept coordinates or zipcode in order to find listings in the area. As of now, database has listings in Tulsa, Jenks, and Sand Springs. **The request must have a latitude and longitude or a zipcode query in order to find listings.** This is because a user will need to allow location services and send their location with the listing, or they must provide their zipcode. They can always extend the radius regardless.

The endpoint can also accept a radius to search by. The default search radius is 15 miles. 

Finally, the endpoint can accept categories to search by. The categories are structured as "Category" or "Category > Subcategory".

#### By Coordinates
Use the lat and long query parameters.

**URL**: http://localhost:4000/api/listings?lat=36.1555&long=-95.9950

#### By Zipcode
**URL**: http://localhost:4000/api/listings?zipcode=74105

#### With Categories (No Subcategories)
**URL**: http://localhost:4000/api/listings?zipcode=74105&categories=["Furniture"]

#### With Categories and Subcategories
**URL**: http://localhost:4000/api/listings?zipcode=74105&categories=["Decor/Art", "Decor/Art > Pottery"]

#### With Radius
**URL**: http://localhost:4000/api/listings?zipcode=74105&radius=5


## API Core Structure
The API aligns with the **Separation of Concerns**, which makes it more modular, testable, and maintainable. With this principle, the functionality is broken up so that one file or function is not handling too much at a time.

### File Structure

`src/`
- Contains the main functionality of the API. All listed files and folders are within `src/`

`app.ts`
- Focuses on configuring the Express application (middlewares, routes, Swagger setup). It exports `{ app }` to be used in `server.ts`

`server.ts`
- Main entry point. Handles the responsibility of starting the server by binding to a post and opening for traffic.

#### Configurations - config/

- Sets up configurations for the server. 

`environment.ts`
- Establishes the environment variables from the local .env and exports the configs to be used from anywhere within the project. Exports `{ ENV }` to use as the variable containing the keys.

`firebase.ts` 
- Uses `{ ENV }` to connect to both the Firestore Database (NoSQL) and the Firebase Storage (Images). It exports `{ db }` for firestore, and `{ storage }` for firebase.

#### Routes - routes/
Establishes the routes to create the endpoints of the API

`index.ts`
- Establishes the `Express.Router()` and imports the modular routes. 

`listingsRoutes.ts`
- Establishes the `Express.Router()` for the routes pertaining to listings management. View the endpoints below. All functions called within the endpoints will be inside the `controllers/listingsController.ts`.

`usersRoutes.ts`
- Establishes the `Express.Router()` for the routes pertaining to user management. View the endpoints below. All functions called within the endpoints will be inside the `controllers/usersController.ts`.

#### Controllers - controllers/
Handles HTTP requests and client responses. 

`listingsController.ts`
- Parses incoming request data, validates the input data, and calls appropriate service functions. Then, constructs the HTTP response and status codes for the client. Functions include `fetchListings`, `createListing`, `updateListing`, `addImage`, `removeImage`, and `deleteListing`.

`usersControllers.ts`
- Parses incoming request data, validates the input data, and calls appropriate service functions. Then, constructs the HTTP response and status codes for the client. Functions include `fetchUsers`, `fetchSavedListings`, `saveListing`, `removeSavedListings`, `fetchUserListings`, and `deleteUser`.

#### Services - services/
- Handles database interaction and storage. Uses information sent from the `controllers` to access the DB and Storage. 

`listingService.ts`
- Handles the /listings collection with the DB and the image storage in firestore. Functions include `getListings`, `postListing`, `updateListingInDB`,`addImageToListing`, `removeImageInDB`, and `removeListingInDB`.

`userService.ts`
- (**not yet implemented**)

`imageService.ts`
- Handles connections to the Firebase storage for images. Functions include `uploadImageToFirebase`, `removeImageInFirebase`, `removeFolderInFirebase`, and `getFilePathFromURI`.

`geolocateService.ts`
- Handles geolocation services and access to the third-party API, GeoApify. Functions include `generateGeo`, `generateCoordinatesByAddress`, and `generateCoordinatesByZipcode`.

#### Models - models/
Contains interfaces and types used for consistency across the project. 

`listingModel.ts`
- Contains the most up to date interface of `Listing`, which is used across the project.

#### Middleware - middlewares/
Holds the middleware configurations needed for authentication and error handling (**not yet implemented**)

`authMiddleware.ts`
- (**not yet implemented**)

`errorHandler.ts`
- (**not yet implemented**)

#### Seed - seed/
Used to seeding the database. Contains lots of formatting for previous versions of data, and was updated frequently with new requests for posting documents. Should not be used to seed database, but housed for future implementations. Also hold images/ used in the project. 


#### Documentation - swagger/
Holds the configurations for the swaggerUI documentation.

`swagger.json`
- Contains most of the rules set up to build the UI for the API documentation.


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
    "categories": array string PUB[],
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
