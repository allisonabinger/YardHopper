# API
The server directory contains the source code for the YardHopperAPI hosted on Render. Please navigate to https://yardhopperapi.onrender.com/api-docs for the Swagger UI on the endpoints, or view [Endpoints](#endpoints) below.

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

## Endpoints
The following endpoints are up to date with what is hosted on Render.


### GET /api/listings
The `GET /api/listings` endpoint will need accept coordinates or zipcode in order to find listings in the area. As of now, database has listings in Tulsa, Jenks, and Sand Springs. **The request must have a latitude and longitude or a zipcode query in order to find listings.** This is because a user will need to allow location services and send their location with the listing, or they must provide their zipcode. They can always extend the radius regardless.

The endpoint can also accept a radius to search by. The default search radius is 15 miles. It will also accept searching by categories, but not subcategories

**Request Endpoint Example**

With coordinates:
https://yardhopperapi.onrender.com/api/listings?lat=36.1555&long=-95.9950

With zipcode:
https://yardhopperapi.onrender.com/api/listings?zipcode=74105

With categories
https://yardhopperapi.onrender.com/api/listings?lat=36.1555&long=-95.9950&categories=Furniture,Clothing

With specified zipcode
http://localhost:4000/api/listings?zipcode=74105&radius=5

The API will respond with the public fields in an array of listings. Here is an example:

```
"listings": [
        {
            "title": "Gadget & Electronics Sale",
            "description": "Great deals on TVs, gaming consoles, and home entertainment systems.",
            "address": {
                "zip": 74113,
                "city": "Tulsa",
                "street": "3123 Riverside Dr",
                "state": "OK"
            },
            "dates": [
                "2024-12-16"
            ],
            "startTime": "09:00",
            "endTime": "15:00",
            "images": null,
            "categories": [
                "Electronics"
            ],
            "status": "upcoming",
            "g": {
                "geohash": "9y7trz42v",
                "geopoint": {
                    "_latitude": 36.1177021,
                    "_longitude": -95.98421015865983
                }
            },
            postId: "oRMe8Lq7KcPtf9JyMyWG"
        },
        ...
]

```

### GET /api/listings/:postId
The `GET /api/listings` endpoint serves to provide data for a single listing. It accepts no parameters.

**Request Endpoint Example**
GET https://yardhopperapi.onrender.com/api/listings/KwLTqIjazVDMMPkS3ldZ


```
{
    "listing": {
        "title": "Test Title",
        "description": "Test Description",
        "address": {
            "zip": 74103,
            "street": "15 N Cheyenne Ave",
            "state": "OK",
            "city": "Tulsa"
        },
        "dates": [
            "2024-12-14"
        ],
        "startTime": "09:00",
        "endTime": "13:00",
        "images": null,
        "categories": [
            "Clothing",
            "Shoes/Accessories",
            "Textiles"
        ],
        "status": "upcoming",
        "g": {
            "geohash": "9y7txtfw2",
            "geopoint": {
                "_latitude": 36.15573785714285,
                "_longitude": -95.99505942857142
            }
        },
        "postId": "KwLTqIjazVDMMPkS3ldZ"
    }
}
```

### POST /api/listings
The endpoint will handle parsing the user information and generating the metadata for the db to query later. It accepts the listing data in the body. 

**Request Endpoint Example**
PUT https://yardhopperapi.onrender.com/api/listings/


**Request Body Examples -- MUST BE JSON**
```
  {
    "title": string,
    "description": string,
      "address": object {
        "zip": number,
        "city": string,
        "street": string,
        "state": string
      },
    "dates": array [string],
    "startTime": string,
    "endTime": string,
    "categories": array [string],
    "subcategories": object {
      Broad Category (string): array [string]
    },
    "userId": string
  }
```

Here is an example of user submitted listing data that is sufficient to post to the API:
```
  {
    "title": "Home Improvement & Tools Sale",
    "description": "Tools, power equipment, and automotive parts at unbeatable prices.",
      "address": {
        "zip": 74113,
        "city": "Tulsa",
        "street": "3123 Riverside Dr",
        "state": "OK"
      },
    "dates": ["2024-12-16"],
    "startTime": "09:00",
    "endTime": "15:00",
    "categories": ["Tools/Parts"],
    "subcategories": {
      "Tools/Parts": ["Power Tools", "Automotive"]
    },
    "userId": "h8KUzPZ8LLeWP8Fx3I6GvhFf8Xo2"
  }
```
The API will respond with the postId of the newly created listing:
```
{
    "postId": "KwLTqIjazVDMMPkS3ldZ"
}
```

### PUT /api/listings/:postId
This route is used for updating the text fields of the listing, such as `title`, `description`, or `startTime`. The `postId` is necessary for the server to find the right post to update, and must accept updated fields in the body to update the post.

**Request Endpoint Example**
PUT https://yardhopperapi.onrender.com/api/listings/KwLTqIjazVDMMPkS3ldZ

**Request Params**
postId: "KwLTqIjazVDMMPkS3ldZ"

**Request Body - JSON**
```
  {
    "startTime": "07:00"
  }
```

### DEL /api/listings/:postId
This route is user for deleting a listing. It will delete the data stored in the firestore database, as well as any images attached to the listing. It accepts the `postId` as the parameter.

**Request Endpoint Example**
DEL https://yardhopperapi.onrender.com/api/listings/DOcNhHR25vTD70cmlySs

**Request Params**
postId: "DOcNhHR25vTD70cmlySs"


### POST /api/listings/:postId/images
This route is used for adding images to a listing. It will accept a `file` in the request, as well as an image `caption` as a string in the body, and the `postId` in the parameters.

```
    { postId } = req.params;
    { caption } = req.body;
    { file } = req;
```

**Request Endpoint Example**
POST https://yardhopperapi.onrender.com/api/listings/KwLTqIjazVDMMPkS3ldZ/images

**Request Params**
postId: "KwLTqIjazVDMMPkS3ldZ"

**Request Body**
```
    "caption": "More Items",
```

**Request Body - File**
(accepts all image types, preferrably jpeg)
The `key` for the file must be `image`, and the type set to file. The `value` is the actual file submitted. There is no `description` needed.



### PUT /api/listings/:postId/images
This route is used for updating the caption of an image. It accepts the `postId` as the parameter of an image, and the `uri` and `caption` to update. 

```
    { postId } = req.params;
    { uri, caption } = req.body;
```

**Request Endpoint Example**
PUT https://yardhopperapi.onrender.com/api/listings/KwLTqIjazVDMMPkS3ldZ/images

**Request Params**
postId: "KwLTqIjazVDMMPkS3ldZ"

**Request Body - JSON**
```
  {
    uri: "https://firebasestorage.googleapis.com/v0/b/yardhopper-7aeb4.firebasestorage.app/o/listings%2FKwLTqIjazVDMMPkS3ldZ%2Ff00a0284-64e2-4d92-b1e8-73c0c471e68b-Generic8.jpeg?alt=media",
    "caption": "Updated Caption",
  }
```


### DEL /api/listings/:postId/images
This route is user for deleting an image within a listing. It will delete the image stored in Firebase, and then removes any reference to the image and caption. It accepts the `uri` and `postId` as parameters.

```
    { postId } = req.params;
    { uri } = req.query;
```

**Request Endpoint Example**
DEL https://yardhopperapi.onrender.com/api/listings/KwLTqIjazVDMMPkS3ldZ/images

**Request Params**
postId: "KwLTqIjazVDMMPkS3ldZ"
uri: "https://firebasestorage.googleapis.com/v0/b/yardhopper-7aeb4.firebasestorage.app/o/listings%2FKwLTqIjazVDMMPkS3ldZ%2Ff00a0284-64e2-4d92-b1e8-73c0c471e68b-Generic8.jpeg?alt=media"


---

### GET /api/users/me
This endpoint is for verfiying a user and displaying their profile. A user's uid is extracted from the `Authorization` header and the uid is used to gather their account in Firebase Auth. An encryption service is used to find their user profile stored in the Firestore Database.

**Request Endpoint Example**
GET https://yardhopperapi.onrender.com/api/users/me

**Request Header**
`Authorization: Bearer ${idToken}`

The API will return data regarding the user's profile. Here is an example response:

```
{
    "first": "John",
    "last": "Doe",
    "email": "test@test.com",
    "street": "15 N Cheyenne Ave",
    "city": "Tulsa",
    "state": "OK",
    "zipcode": 74103,
    "createdAt": "2024-12-03T16:17:33Z"
}
```


### POST /api/users/create
This endpoint is designed to create a new user profile in the Firestore Database with user information. It does not create a user account in Firebase Auth, so the account will be created in the client app. The requests accepts user details in the body, connects the `email` and `createdAt` fields stored in FirebaseAuth with the uid, and creates a user document with their profile details. 

The required fields in the **body** are `first`, `last`, and `zipcode`.
Option fields are the address of the user, including `street` (street address), `city`, and `state`.

**Request Endpoint Example**
POST https://yardhopperapi.onrender.com/api/users/create

**Request Header**
`Authorization: Bearer ${idToken}`

**Request Body -- MUST BE JSON**
```
{
    "first": "Jenny",
    "last": "Doe",
    "street": "15 N Cheyenne Ave",
    "city": "Tulsa",
    "state": "OK",
    "zipcode": 74103,
}
```

The response returned from the API will message and the newly created profile.
```
{
    "message": "User profile created successfully",
    "data": {
        "userId": "1a67f57e385d82320e1f8c1985932f535e04f708bc63c5e7e0401fc7393f1b57",
        "first": "Yard",
        "last": "Hopper",
        "email": "yardhopperadmn@gmail.com",
        "street": "15 N Cheyenne Ave",
        "city": "Tulsa",
        "state": "OK",
        "zipcode": 74103,
        "savedListings": [],
        "userListings": [],
        "createdAt": "Sat, 30 Nov 2024 17:51:04 GMT"
    }
}
```

### DEL /api/users/me
This endpoint will handle deleting the user's account in Firebase Auth as well as their profile in Firestore. It will also delete all listings that user has posted regardless of status.

**Request Endpoint Example**
DEL https://yardhopperapi.onrender.com/api/users/me

**Request Header**
`Authorization: Bearer ${idToken}`

The response returned from the API will be a successful deletion message:

```
{
    "message": "User successfully deleted"
}
```


### PUT /api/users/update
This endpoint handles user information updates to the `users` documents in the Firestore Database. The **body** will contain the updated user details, and the fields must match the database.

**Request Endpoint Example**
PUT https://yardhopperapi.onrender.com/api/users/update

**Request Header**
`Authorization: Bearer ${idToken}`

**Request Body -- MUST BE JSON**
```
{
    "first": "Georgia",
}
```

The response returned from the API will be a successful updated message, as well :

```
{
    "message": "User profile updated successfully",
    "data": {
        "first": "Georgia",
        "last": "Doe",
        "email": "user2@yahoo.com",
        "street": "15 N Cheyenne Ave",
        "city": "Tulsa",
        "state": "OK",
        "zipcode": 74103
    }
}
```

### GET /api/users/listings
This endpoint will get all of the listings a user has made, regardless of status.

**Request Endpoint Example**
GET https://yardhopperapi.onrender.com/api/users/listings

**Request Header**
`Authorization: Bearer ${idToken}`

If the user has no listings, the server will respond with a message:

```
{
    "status": 500,
    "message": "User has no listings"
}
```

If the user has made listings, the server will respond with the listings data in an array:

```
[
    {
        "title": "Lots of clothes!",
        "description": "Affordable clothing, shoes, and accessories.",
        ...
    },
    {
        ...
    }
]
```

### GET /api/users/savedListings
This endpoint handles accessing the user's `savedListings`, which is an array of postIds, and retrieves them in the listings collection. 

If a postId is found in the savedListing that does not have the `upcoming` or `active` status, then it will be removed from the savedListing array and not returned in the response.

**Request Endpoint Example**
GET https://yardhopperapi.onrender.com/api/users/savedListings

**Request Header**
`Authorization: Bearer ${idToken}`

If the user has no listings, the server will respond with a message:

```
{
    "status": 500,
    "message": "User has no listings"
}
```

If the user has saved listings, they will be returned as an array:
```
{
    "savedListings": [
        {
            "title": "Home Improvement & Tools Sale",
            "description": "Tools, power equipment, and automotive parts at unbeatable prices.",
            ...
        }
    ]
}
```

### POST /api/users/savedListings
This endpoint will add a new `postId` from the request body into the user's `savedListings` array in the users Firestore Database document. 

**Request Endpoint Example**
POST https://yardhopperapi.onrender.com/api/users/savedListings

**Request Header**
`Authorization: Bearer ${idToken}`

**Request Body -- MUST BE JSON**
```
{
    "postId": "6VpUpFaeAHvA9Ew9zAkj",
}
```
The server will respond with a message upon successful addition:

```
{
    "message": "Listing saved successfully"
}
```
### DELETE /api/users/savedListings
This endpoint will remove a `postId` from the request body into the user's `savedListings` array in the users Firestore Database document. 

**Request Endpoint Example**
DEL https://yardhopperapi.onrender.com/api/users/savedListings

**Request Header**
`Authorization: Bearer ${idToken}`

**Request Body -- MUST BE JSON**
```
{
    "postId": "6VpUpFaeAHvA9Ew9zAkj",
}
```
The server will respond with a message upon successful deletion:

```
{
    "message": "Listing saved successfully"
}
```



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
Node.js, Express, Firebase, Firestore, Swagger

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
    "subcategories": map string PUB{
        "Broad Category" array[]: "subcategory", "subcategory" 
    }
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
Firebase Authentication is used to authenticte users, as well as Google OAuth for users to be able to sign in with their google account. Each request to the API must be from an authenticated user. Authentication is handled in the app with firebase authentication, and user information is encrypted before requests are sent and handled within the server to ensure no interception of sensitive information occurs. 

### Encryption
Certain protected information is encrypted before being sent through HTTP requests and other data transfers. The backend API can validate tokens sent from client to ensure private data is not public traffic.

### Privacy
Users will not have their information public to others, so there is not identifying data that is listed on sales. The response from the API will only include public fields that will be necessary to display the listing and filter the posts by user input.

Users will be able to archive their posts, and once a post has been archived, the image will be deleted from the database to perserve storage and ensure privacy. 


## Optimization


## Auto-Cleanup
There is currently one cloud function service that will check for any listings that should be archived. At midnight each day, it looks at the listings for their active dates and compares it to the current date. It will then update the `status` of the sale accordingly to ensure no expired sales are shown, and upcoming sales are switched to `active` when the day arrives. 
