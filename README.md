# MarText — SMS Marketplace

MarText lets people post and search local classified listings through text messages. It was designed for situations where SMS is available but mobile internet access is limited. Built by Tommy Nguyen, Matthew Orchard, Hao Zhong, Khalid Alam, and Garrett Audet, the project combines SMS messaging, location-based search, and conversational interactions to help users navigate listings.

## Project status

This repository preserves a historical implementation of MarText. The original concept was an internet-less marketplace via SMS: users interact through text messages, while the backend connects to online services. The code and dependency versions reflect that period; a working hosted service or compatibility with current service APIs is not assumed.

## How it works

1. **Receive a message.** An Express endpoint accepts a Twilio SMS webhook at `POST /twilio/sms/reply`. The React phone simulator sends messages to the same conversation service through `POST /client/messages/send`.
2. **Understand the request.** IBM Watson Assistant manages the conversation and returns text or an action with the collected context.
3. **Carry out the action.** The backend can create a listing, search listings, show a selected listing, or update a user's location.
4. **Find nearby listings.** Cloudant stores users, posts, and saved search results. Search filters by category, matches listing titles and descriptions, and limits results to locations within 100 km. Google Maps geocodes location text.
5. **Reply.** SMS requests receive a TwiML response; the browser simulator displays the returned messages.

## Illustrative SMS journey

This example describes the intended interaction, not a recorded conversation or a guaranteed set of commands. Exact prompts depend on the Watson Assistant configuration.

- A user provides their location.
- They ask to find a bicycle and supply a category and search terms.
- MarText returns a numbered list of matching nearby listings.
- The user replies with a result number to see its title and description.
- To post a listing, the user supplies the details requested by the conversation and receives a confirmation when it is saved.

## Repository guide

- [`app.js`](app.js): Express entry point and static client hosting
- [`routes/`](routes/): Twilio webhook and browser-client endpoints
- [`services/`](services/): conversation handling, listing actions, search, and location helpers
- [`connections/`](connections/): external-service clients
- [`client/`](client/): React phone simulator

## Development reference

The original backend declares Node.js 10, and the client uses React 16 with `react-scripts` 3. These are legacy dependencies. Review the runtime and integrations before attempting to run or deploy the project.

The existing development commands are:

```sh
npm install
npm install --prefix client
npm run dev-both
```

`npm run dev-both` starts the backend with nodemon and the React development server. The backend defaults to port 5000, and the client proxies requests to it. `npm run build-and-start` builds the client and starts the Express server.

A functional conversation also requires external configuration:

- Cloudant credentials and the databases referenced in [`connections/cloudant-connections.js`](connections/cloudant-connections.js)
- A Watson Assistant instance, credentials, and dialog configuration matching the actions in [`services/action-service.js`](services/action-service.js)
- A Google Maps API key for geocoding
- A configured Twilio number and webhook for the SMS route

The backend reads configuration from environment variables through `dotenv`. Keep credentials outside version control. The repository does not include the Watson dialog definition or provision the external services, so these commands alone are not a complete deployment recipe.
