In this document, we list the various API endpoints that our backend supports:
NOTE: For all endpoints, status code 401 means that the operation was not authenticated.

------------------------------------------------------------------------------------

GET /
Returns "Hello DeskBuddy". Used to verify if the backend is operational or not.
Status code 200 - Accessing endpoint was successful

------------------------------------------------------------------------------------

POST /reservation
Creates a reservation, with the parameters of the reservation given in the body.
Status code 200 - Creating a reservation was successful
Status code 400 - Request body was malformed or missing
Status code 404 - Error in creating a reservation

GET /getAllReservations
Gets all reservations (this is a test endpoint, but it is being used in actual production. what do we do about this?)

GET /reservation/upcoming
Gets all upcoming reservations from the current date onwards.
Status code 200 - Getting reservations was successful
Status code 404 - Internal database error

GET /reservation/upcoming/:date
Gets all upcoming reservations for some particular date.
Status code 200 - Getting reservations was successful
Status code 404 - Internal database error

GET /reservation/count/:officeID/:start/:end
Gets the number of reservations for a single office for a given date range.
Status code 200 - Getting number of reservations was successful
Status code 404 - Internal database error

DELETE /reservation/:reservationID
Deletes a given reservation by its ID.
Status code 200 - Deleting was successful.
Status code 404 - Reservation did not exist

------------------------------------------------------------------------------------

GET /office
Gets all the company-wide offices.
Status code 200 - Getting all offices was successful
Status code 404 - Internal database error

GET /floor/:officeLoc/:officeID
Get all floors from an office by its location and ID.
Status code 200 - Getting floors was successful
Status code 404 - Internal database error

GET /desk/:officeLoc/:officeID
Get all desks in a particular office irrespective of their floor.
Status code 200 - Getting all desks was successful
Status code 404 - Internal database error

POST /desk/getOpenDesks
Get all available desks? (Are the office parameters inside some kind of req body?)
(Unless specified otherwise, I'm going to change this to GET /desk/open/:officeLoc/:officeID)

------------------------------------------------------------------------------------

POST /location
Adds a new location, based on parameters passed in the request body.
Status code 200 - Adding a new office was successful
Status code 404 - Office already exists

DELETE /location/:city/:id
Deletes a location by city and ID.
Status code 200 - Deleting an office was successful
Status code 404 - Office does not exist

------------------------------------------------------------------------------------