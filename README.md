# Too good not to be notified

Customizable notification service for [Too Good To Go](https://toogoodtogo.fr/) (TGTG) application.

---

If you have ever used the TGTG application, you have probably had, like me, a great deal of frustration. The frustration of not being able to set up notifications on this application. You can only open the application compulsively at the times when baskets are usually available, otherwise you are condemned to systematically go last, and nothing is available anymore.

---

## Features

### Get notified instantly when a basket is available

When a basket is available in your area, you receive an instant SMS notification. **No delay**.

![SMS](./docs/readme-resources/sms.png)

### Configure a cooldown so you don't get spammed

Fully configurable cooldowns that ensure you don't get spammed with notifications :

- A first high-level cooldown that blocks all notifications for X hours once notified
- A much more precise cooldown configured by store, which ensures some variety in notifications. You then can't get notified for a store that already notified you for X hours.

![Cooldown](./docs/readme-resources/cooldown.png)

### Be notified only at the times of day you choose

You can enter the specific times of the day you wish to be notified. You will **never** be notified outside of these ranges. This ensures that you are not notified at critical times such as at night or during your working hours for example.

![Sleep](./docs/readme-resources/sleep.jpg)

## Execute locally

### Setup your local environment for the first time

#### Prerequisites

- Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop).
- Setup your [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-mac.html).

#### Steps

##### Create docker-compose file :

Create a `docker-compose.yml` file, put this snippet in it :

```yaml
version: "3.8"
services:
  dynamodb-local:
    command: "-jar DynamoDBLocal.jar -sharedDb -optimizeDbBeforeStartup -dbPath ./data"
    image: "amazon/dynamodb-local:latest"
    container_name: dynamodb-local
    ports:
      - "8000:8000"
    volumes:
      - "./docker/dynamodb:/home/dynamodblocal/data"
    working_dir: /home/dynamodblocal
```

##### Run it with Docker

Go to your Terminal, go to the folder where you created the docker-compose file, and run this :

`docker-compose up -d`

You know have a local DynamoDB service up & running.

##### Install Dynamo GUI

You can work with a pretty useful DynamoDB GUI for your local interactions with dynamo. Simply install the lib globally :

`npm i -g dynamodb-admin`

Then run on your Terminal :

`DYNAMO_ENDPOINT=http://localhost:8000 dynamodb-admin`

You can then open your browser to `http://localhost:8001` (whatever the execution script tells you) to access GUI.

##### Put data in the database

If you use the GUI, you can easily create your data.

Create Table :

Create a table named like what is in serverless env variable DYNAMODB_CONSUMERS_TABLE
Hash attribute name `contact` of type `String`
Leave everything like it is, click Submit.

Go in this table and click Create Item, use this sample data :

```json
{
  "lastNotificationDate": 1606359175685,
  "lastStoreNotif": [],
  "location": {
    "lat": 50.62679972997623,
    "long": 3.0567717525498934
  },
  "notifPreference": [
    {
      "end": "14:00",
      "start": "12:00"
    },
    {
      "end": "19:00",
      "start": "16:30"
    },
    {
      "end": "22:00",
      "start": "21:00"
    }
  ],
  "contact": "abcd@gmail.com",
  "radius": 5
}
```

You can replace location, notifPreference, contact and radius with values you want.

### Start your local env

You can now run `npm run offline`, and, ta-da !

You can now trigger the script via HTTP request and it'll fully work.

The SNS notification is mocked, nothing will be sent, for tests purpose. But every other feature works as in production.

### Everyday use

When everything is setup, you'll just need to run the `docker-compose up -d` command to run DynamoDB local if the container is down, and run `npm run offline`.

