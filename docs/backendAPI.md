In this document, we list the various API endpoints that our backend supports:<br/>
NOTE: For all endpoints, status code 401 means that the operation was not authenticated.<br/>

------------------------------------------------------------------------------------

GET /<br/>
Returns "Hello DeskBuddy". Used to verify if the backend is operational or not.<br/>
Status code 200 - Accessing endpoint was successful<br/>

------------------------------------------------------------------------------------

POST /reservation<br/>
Creates a reservation, with the parameters of the reservation given in the body.<br/>
Status code 200 - Creating a reservation was successful<br/>
Status code 400 - Request body was malformed or missing<br/>
Status code 404 - Error in creating a reservation<br/>

GET /getAllReservations<br/>
Gets all reservations (this is a test endpoint, but it is being used in actual production. what do we do about this?)<br/>

GET /reservation/upcoming<br/>
Gets all upcoming reservations from the current date onwards.<br/>
Status code 200 - Getting reservations was successful<br/>
Status code 404 - Internal database error<br/>

GET /reservation/upcoming/:date<br/>
Gets all upcoming reservations for some particular date.<br/>
Status code 200 - Getting reservations was successful<br/>
Status code 404 - Internal database error<br/>

GET /reservation/count/:officeID/:start/:end<br/>
Gets the number of reservations for a single office for a given date range.<br/>
Status code 200 - Getting number of reservations was successful<br/>
Status code 404 - Internal database error<br/>

DELETE /reservation/:reservationID<br/>
Deletes a given reservation by its ID.<br/>
Status code 200 - Deleting was successful.<br/>
Status code 404 - Reservation did not exist<br/>

------------------------------------------------------------------------------------

GET /office<br/>
Gets all the company-wide offices.<br/>
Status code 200 - Getting all offices was successful<br/>
Status code 404 - Internal database error<br/>

GET /floor/:officeLoc/:officeID<br/>
Get all floors from an office by its location and ID.<br/>
Status code 200 - Getting floors was successful<br/>
Status code 404 - Internal database error<br/>

GET /desk/:officeLoc/:officeID<br/>
Get all desks in a particular office irrespective of their floor.<br/>
Status code 200 - Getting all desks was successful<br/>
Status code 404 - Internal database error<br/>

POST /desk/getOpenDesks<br/>
Get all available desks? (Are the office parameters inside some kind of req body?)<br/>
(Unless specified otherwise, I'm going to change this to GET /desk/open/:officeLoc/:officeID)<br/>

------------------------------------------------------------------------------------

POST /location<br/>
Adds a new location, based on parameters passed in the request body.<br/>
Status code 200 - Adding a new office was successful<br/>
Status code 404 - Office already exists<br/>

DELETE /location/:city/:id<br/>
Deletes a location by city and ID.<br/>
Status code 200 - Deleting an office was successful<br/>
Status code 404 - Office does not exist<br/>

------------------------------------------------------------------------------------