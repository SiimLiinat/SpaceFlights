# Space Flights

Made by Siim Liinat.

<kbd>![Screenshot 2022-01-23 at 01-31-57 Cosmos Odyssey](https://user-images.githubusercontent.com/57288361/150658988-2ad82057-9768-4cef-a2b3-ead7eeaee45a.png)</kbd>

## How to run:

1) Install nodeJS and npm.
2) Open the folder  in a terminal and run the following command:
```
npm install
```

3) Once finished, run the following command:
```
npm run start
```
4) The terminal should show the IP addresses the app is running on. Click on one of them or copy the url to a browser.


## Network errors:
If there are CORS-related network issues, turn off CORS in your browser. As far as I've checked, this is an issue with
the server the web app gets its data from (https://cosmos-odyssey.azurewebsites.net/api/v1.0/TravelPrices) not allowing CORS. This shouldn't be an issue with my code, but
if I'm wrong, and it is, please let me know.
