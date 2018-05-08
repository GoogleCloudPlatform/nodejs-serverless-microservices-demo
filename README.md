# Web page visual history

A set of microservices to track visual changes of web pages.

**This code is provided as example only. It is provided without guarantee or level of support.** This is not an official Google product (experimental or otherwise), it is just code that happens to be owned by Google.

## Dependencies

* Google Cloud Platform
* App Engine
* Cloud Functions
* Cloud Datastore
* Cloud Storage
* Cloud Pub/Sub
* App Engine cron

## List of micro services

Each micro service is stored in its dedicated folder.

* `frontend`: A frontend to vizualise which websites are tracked and see their screenshots
* `task-scheduler`: Every 5 minutes, looks for screenshots to take and schedule them as tasks.
* `screenshot`: Takes screenshots of the given URL, stores it in Cloud Storage
* `image-diff`: Compares an image with its reference image in Cloud Storage

## Architecture

TODO: Add diagram image

Every 5 minutes, the `task-scheduler` microservice runs, queries the Cloud Datastore database for webpages ot screenshot.
For each webpage, it sends a message to a Pub/Sub topic.
This topic is responsible for pushing these messages to the `screenshot` microservice.
This `screenshot` service receives the message as a regular HTTP POST request, screenshots requested webpage and stores the result in a Cloud Storage bucket. 
The creation of a new file in the bucket triggers the a Cloud Function (`image-diff`).
The `image-diff` function compares the new image with a reference image from the `references` folder. If a difference is found, it stores the image in a `keyframe` folder and updates the reference image.

The `frontend` service is a web frontend that allows to browse the data: Its main page lists the currently tracked webpages, clicking on a webpage shows all the saved keyframes for this webpage. Users can start tracking a new webpage by entering its URL, which will add a new entity to the Cloud Datastore database.

## Potential Improvements

* tooling to deploy from scratch (Deployment Manager?)
* app to clean up the "staging" bucket
* User can delete a particular keyframe, from the UI.
* Basic styling of the frontend (use https://material.io/components/web/)
* Hangouts Chat notifier function
* User can delete a website
* Add a back action on the website details page
* make screenshot screen resolution configurable 

## License

[Apache 2.0](./LICENSE)
