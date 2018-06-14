# Awesome Flight Status

Flight status micro-service based on Google Cloud Functions platform.

## Functions emulator

Run `npm run start-emulator` to run the [Cloud Functions Emulator](https://github.com/GoogleCloudPlatform/cloud-functions-emulator/).

## Development server

Run `npm run dev` to deploy the `flightStatus` function locally using the Cloud Functions Emulator, then navigate to `http://localhost:8010/<your-project>/<your-zone>/flightStatus`.

**Important**: You need previously configure your GCP project and zone with [Cloud SDK](https://cloud.google.com/sdk/).

## Debugging

Run `npm run debug` to run the cloud functions emulator debugger, then use the config in `.vscode/launch.json` to debug your function locally.

## Logs

Run `npm run logs` to see the latest 100 lines in your log file. For more info visit ["Viwing Logs" in Cloud Functions Emulator](https://github.com/GoogleCloudPlatform/cloud-functions-emulator/wiki/Viewing-logs).

## Running unit tests

Run `npm test` to execute the unit tests via [Jest](https://facebook.github.io/jest/).