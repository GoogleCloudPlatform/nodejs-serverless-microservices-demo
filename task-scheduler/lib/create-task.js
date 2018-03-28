/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const google = require('googleapis');
const cloudtasks = google.cloudtasks('v2beta2');

function authorize (callback) {
  google.auth.getApplicationDefault(function (err, authClient) {
    if (err) {
      console.error('authentication failed: ', err);
      return;
    }
    if (authClient.createScopedRequired && authClient.createScopedRequired()) {
      var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
      authClient = authClient.createScoped(scopes);
    }
    callback(authClient);
  });
}

/**
 * Create a task for a given queue with an arbitrary URL.
 */
function createTask (project, location, queue, relative_url) {
  authorize((authClient) => {
    const task = {
      app_engine_http_request: {
        http_method: 'GET',
        app_engine_routing: {
            service: process.env.TARGET_SERVICE
        },
        relative_url: relative_url
      }
    };

    const request = {
      parent: `projects/${project}/locations/${location}/queues/${queue}`,
      resource: {
        task: task
      },
      auth: authClient
    };

    console.log(`Sending task: service ${process.env.TARGET_SERVICE}, URL: ${relative_url}`);

    cloudtasks.projects.locations.queues.tasks.create(request, (err, response) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  });
}

exports.createTask = createTask;