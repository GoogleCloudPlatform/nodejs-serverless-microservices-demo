# Schedule screenshot tasks

When executed, this microservice looks for screenshots to grab and stores them as tasks in the "screenshot" queue.

## Required environment variables:

- GOOGLE_CLOUD_PROJECT: Project ID 
- QUEUE_ID: the queue name to creates tasks in.
- QUEUE_LOCATION: region of the queue
- TARGET_SERVICE: name of the service that takes screenshots
- TOPIC_NAME: Name of the Pub/Sub topic to send events to.
- SUBSCRIPTION_NAME: Name of the Pub/Sub subscription

## Dependencies

Create a Pub/Sub topic with `gcloud pubsub topics create $TOPIC_NAME`.

Create a Pub/Sub subscription with:
```
gcloud beta pubsub subscriptions create $SUBSCRIPTION_NAME \
   --topic $TOPIC_NAME \
   --push-endpoint \
     https://$TARGET_SERVICE-dot-$GOOGLE_CLOUD_PROJECT.appspot.com/ \
   --ack-deadline 30
```

## Deployment

Deploy the service with `npm run deploy`.

## Scheduling this microservice

Schedule the execution of this microservice with `gcloud app deploy cron.yaml`.

## Development

Make sure to have the proper env vars in place, then start local development with `npm start`.
