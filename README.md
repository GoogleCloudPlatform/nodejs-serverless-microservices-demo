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

See [diagram](https://docs.google.com/presentation/d/1w71AEGUz3ZwirmNzvHkGSwnkUeTa25iz7lKVCkEfUJo/edit#slide=id.g371a2bab30_0_0).

* `frontend`: A frontend to vizualise which websites are tracked and see their screenshots
* `task-scheduler`: Every 5 minutes, looks for new screenshot to take.
* `screenshot`: Takes screenshots of the given URL 
* `image-diff`: Compares an image with its reference image
