var CLIENT_ID = '604436488620-9fj57k32rk4n9v2j6bp231lvrt0avh46.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');
var submitButton = document.getElementById('submit-button');
var clearButton = document.getElementById('clear-button');

function submitForm() {
	console.log(document.getElementById("name").value);
  	console.log(document.getElementById("number").value);
}
/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  	gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
	console.log("Initiating Client");
  	gapi.client.init({
    	discoveryDocs: DISCOVERY_DOCS,
    	clientId: CLIENT_ID,
    	scope: SCOPES
  	}).then(function () {
    	// Listen for sign-in state changes.
    	gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
  	  	gapi.auth2.getAuthInstance().isSignedIn.listen(appendDataMajors);
  		gapi.auth2.getAuthInstance().isSignedIn.listen(clearDataMajors);

    	// Handle the initial sign-in state.
    	updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    	authorizeButton.onclick = handleAuthClick;
    	signoutButton.onclick = handleSignoutClick;
  	  	submitButton.onclick = appendDataMajors;
  		clearButton.onclick = clearDataMajors;
  	});
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  	if (isSignedIn) {
    	authorizeButton.style.display = 'none';
    	signoutButton.style.display = 'block';
  	  	clearButton.style.display = 'block';
  		 listMajors();
  	} else {
    	authorizeButton.style.display = 'block';
    	signoutButton.style.display = 'none';
  	}
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  	gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  	gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  	var pre = document.getElementById('content');
  	var textContent = document.createTextNode(message + '\n');
  	pre.appendChild(textContent);
}

function appendDataMajors(isSignedIn) {
  	gapi.client.sheets.spreadsheets.values.append({
  		spreadsheetId: '11P9LCCAcyWnTj2hyQIN-j8IqQokOj8kMq93rxN8DNp0',
		range: 'Class Data!A2:E',
	  	valueInputOption: 'USER_ENTERED',
	  	values: [[document.getElementById("name").value,document.getElementById("number").value]]
  }).then(function(err,response) {
	  	console.log("THE END");
	  	console.log(err);
	  	console.log(response);
		console.log(window.location);
  	});
  	console.log("Out Here")
}

function clearDataMajors() {
  	console.log("Before Here Clear");
  	gapi.client.sheets.spreadsheets.values.clear({
  		spreadsheetId: '11P9LCCAcyWnTj2hyQIN-j8IqQokOj8kMq93rxN8DNp0',
		range: 'Class Data!A2:E',
  	}).then(function(err,response) {
	  	console.log("THE END");
	  	console.log(err);
	  	console.log(response);
		document.location.href="/";
  	});
  	console.log("Out Here Clear")
}
/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function listMajors() {
  	gapi.client.sheets.spreadsheets.values.get({
    	spreadsheetId: '11P9LCCAcyWnTj2hyQIN-j8IqQokOj8kMq93rxN8DNp0',
    	range: 'Class Data!A2:E',
  	}).then(function(response) {
		console.log(response.result);
    	var range = response.result;
  		console.log(range.values);
		if (range.values != undefined) {
   			if (range.values.length > 0) {
      			appendPre('Name, Major:');
      			for (i = 0; i < range.values.length; i++) {
        			var row = range.values[i];
        			// Print columns A and E, which correspond to indices 0 and 4.
        			appendPre(row[0] + ', ' + row[1]);
      			}		
    	 	} else {
      		appendPre('No data found.');
    	 	}
		}
  	}, function(response) {
    	appendPre('Error: ' + response.result.error.message);
  	});
}