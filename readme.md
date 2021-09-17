# ACM Dev Back-end Developer Challenge B

Google Calendar API challenge for ACM Development - Fall 2021.

#### Testing Routes

- This section will cover how to test the routes implemented in this challenge.

##### Authentication

- To test the calendar routes, you must first authenticate yourself via Google OAuth.
- In your web browser, navigate (here)[`https://us-central1-acm-calendar-api.cloudfunctions.net/challenge/auth/google/login] and login with Google. You will then be redirected to
- Here is an example of what a response body will look like:

```
{
  "api_key": "API_KEY",
  "message": "This is your API key used for authentication for calling any calendar endpoints. It must be passed as `api_key` as a field in your request."
}
```

- Make sure you pass the `api_key` as a field in your JSON request body to any of the calendar endpoints.

##### Event Creation

- To test the event creation route, you can invoke the endpoint (`/event/create`).

- To create an event, you must pass an API key as well as `event_name`, `start_date` and `end_date` fields in the body represented as a JSON object.

- Here is an example below using curl:

```
curl --location --request GET 'https://us-central1-acm-calendar-api.cloudfunctions.net/challenge/event/create' \
--header 'Content-Type: application/json' \
--data-raw '{
    "api_key": "API_KEY_HERE",
    "event_name": "New Event",
    "start_date": "YYYY-MM-DD HH:MM AM/PM",
    "end_date": "YYYY-MM-DD HH:MM AM/PM"
}'
```

##### Event RSVP

- To test the event RSVP route, you can invoke the endpoint (`/event/rsvp`).

- To RSVP to an event, you must pass an API key as well as an `event_id` and `attendee_name` field in the body represented as a JSON object.

- Here is an example below using curl:

```
curl --location --request GET 'https://us-central1-acm-calendar-api.cloudfunctions.net/challenge/event/create' \
--header 'Content-Type: application/json' \
--data-raw '{
    "api_key": "API_KEY_HERE",
    "event_id": "EVENT_ID_HERE",
    "attendee_name": "Ryan"
}'
```

##### Retrieve Participant List

- To test the event participant route, you can invoke the endpoint (`/event/participants`).

- To RSVP to an event, you must pass an API key as well as an `event_id` and `attendee_name` field in the body represented as a JSON object.

- Here is an example below using curl:

```
curl --location --request GET 'https://us-central1-acm-calendar-api.cloudfunctions.net/challenge/event/create' \
--header 'Content-Type: application/json' \
--data-raw '{
    "api_key": "API_KEY_HERE",
    "event_id": "EVENT_ID_HERE",
    "attendee_name": "Ryan"
}'
```

- Here is an example of what the response will look like:

```
{
  "attendeeNames": ["Ryan", "Willie"]
}
```
