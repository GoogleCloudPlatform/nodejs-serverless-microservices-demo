# Website visual history

A set of microservices to track visual regressions on web pages.


## Dependencies

* Google Cloud Platform
* App Engine
* Cloud Functions
* Cloud Datastore API
* [Cloud Tasks API](https://pantheon.corp.google.com/apis/library/cloudtasks.googleapis.com/) (sign up for Alpha at: https://goo.gl/Ya0AZd)
* Cloud Storage API

## Architecture

TODO: Add diagram image

List of micro services:

* `frontend`: A frontend to vizualise which websites are tracked and see their screenshots
* `task-scheduler`: Every 5 minutes, looks for new screenshot to take.
* `screenshot`: Takes screenshots of the given URL 
* `image-diff`: Compares an image with its reference image


## TODO

* document architecture
* tooling and docs about how to deploy from scratch (Deployment Manager?)
* app to clean up the "staging" bucket
* Basic styling of the frontend (use https://material.io/components/web/)
* error handling
* Polish the README files
* Move the screenshot service to GAE Standard
* Hangouts Chat notifier function
* User can delete a website
