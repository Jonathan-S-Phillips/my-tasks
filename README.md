# MyTasks

MyTasks is a simple application meant to create and manage Tasks. Tasks are displayed in tables, separated by state (pending or complete), and can be filtered by name, description, priority, due date, and date completed (if complete). Pending tasks also have keyword filters and visual indicators for tasks over due (tasks with due date before todays date), tasks due today, and tasks due tomorrow. Tasks have a very simple repeating capability. They can repeat daily, weekly, monthly, or yearly, and they are related to each other through the nextId property which corresponds with the id of the next Task in the sequence.

It is a full stack application divided into an Angular client, Express API server,and SQLite database. The client is built using Angular 6 and Typescript, and leverages Angular Material 2 for most of the UI components. The UI is designed to be responsive, and meant to work across a variety of devices. Breakpoints from the angular CDK layout (Handset and Small) are used to determine what features are available on the screen. Smaller screen sizes have only been emulated through chrome devtools and have not been fully tested. The Express API server is built using Typescript, and utilizes the TypeORM package to handle storing data in a SQLite database.

## Getting Started

To download a copy of the project you must have GIT installed and configure on your machine. If you have GIT configured you may download the source code using the following command.

```
git clone https://github.com/Jonathan-S-Phillips/my-tasks
```

Installing and configuring GIT on your machine is outside the scope of this document, but a few helpful links are included below.

* [GIT](https://help.github.com/articles/set-up-git/) - Setup GIT
* [Clone Repo](https://help.github.com/articles/cloning-a-repository/) - Additional details on cloning GIT repo

### Prerequisites

In order to run the application you need to either have Docker Compose or Node installed and configured. The app was built on Windows using the following setup:

* Docker version 18.06.0-ce-win70 (19075)
* Compose 1.22.0
* Node version 8.9.1
* NPM version 6.2.0 

Installing and configuring Docker Compose and Node are outside the scope of this document but a few helpful links are included below.

* [Docker Compose](https://docs.docker.com/compose/install/) - Install Docker Compose
* [Node](https://nodejs.org/en/) - Install Node

### Build and run

You can build and run the MyTasks application one of two ways.

1. Docker Compose; or 
2. Node and NPM. 

#### Docker Compose

If you have Docker Compose configured for your system, then you can use the following command from the root or base directory of the application to build and run both the server and client containers for the app.

```
docker-compose up --build
```

Thats it! It may take some time to setup and configure the containers depending on your connection speed. You may also see some warnings about npm packages, but they will not prevent the app from starting. The "--build" option is only required when building the containers for the first time or after any changes have been made to the code base or dependencies. You may skip to "Running the tests" if you do not need to setup the application using Node. 

**Side Note: I did have to run the below command at some point when I was building the app to sync the time with the server container because of time drift.

```
docker run --rm --privileged mytasks_server hwclock -s
```

#### Node setup

If you have Node configured for your system, then you can use the npm scripts included at the root of the application to build and run the application. You can build each part of the app separately, but I have included scripts at the root to run both the server and client together. The first step to build and run the application directly in your environment is to install dependencies. You can use the following command from the root of the application to install all required dependencies for both the client and server.

```
npm run install-all
```

If you are running npm version 6, then you will see a few vulnerabilities from the dependencies for the client. You can run the following command from the base of the client app to fix one of the vulnerabilities.

```
npm audit fix
```

The remaining fixes include breaking changes, which have not been tested.

Once the dependencies are installed you can use the following command (again from the root of the application) which will build and run both the client and server together.

```
npm run start
```

#### Development Mode

Continuing with the Node configuration, a script is included to start the application in development mode, which uses an in-memory version of the SQLite DB instead of persisting the DB to disk. The code is automatically set up to insert seed data from a JSON array into the DB when running the in-memory version. Run the following command to run the application in development mode.

```
npm run start:dev
```

All e2e tests use the in-memory version of the SQLite DB, and the unit tests use the same JSON array data inserted into the in-memory DB.

## Accessing the app

Once the application is up and running you may access the client through a web browser at http://localhost:4200. The server is setup to listen on port 3000 and the main Tasks API is available at http://localhost:3000/api/tasks.

## Running the tests

The application has both unit and e2e tests. The client is using karma and the server is using mocha and chai for unit tests. The e2e tests use protractor.

### Unit Tests

The unit tests for both the client and server can be run using the following command from the root of the application.

```
npm test
```

A script is also included to generate coverage reports with the unit tests. Running the following command will run the unit tests and generate coverage reports as well.

```
npm run test:coverage
```

Separate coverage reports are generated for the client and the server using Istanbul Code Coverage. A coverage directory is added to both the client and server directories and the reports are added there. To view the reports browse to either the client or server, select the corresponding coverage directory, and open the index.html file found using your favorite browser.

### e2e Tests

The e2e tests can be run using the following command from the root of the application.

```
npm run e2e
```

This command will initialize the server and client, and execute the e2e tests against the app.

** A Note on e2e tests: I have tested the base e2e script on several machines and they only seems to work consistently on relatively high powered processors. While the e2e tests will pass on slower processors, they will fail intermittently with async timeout exceptions. The only way I can seem to get e2e tests to pass more consistently on slower processors is using the "headless" chrome options. If you see failures while running the e2e tests then you might want to try running the headless e2e tests using the following command.

```
npm run e2e:headless
```

A third e2e test script is included which is meant to take screenshots of the application and various elements throughout the app for use in the AboutComponent of the app. The Microsoft Edge browser is the only browser that seems to work to take screenshots of individual elements, so the script uses Edge for the tests. Setting up the Edge browser for e2e tests requires manually downloading the webdriver. Instructions for setting this up are outside the scope of this document. If you have your system set up with the Edge webriver, then you may run the following command to take screenshots while the e2e tests are running.

```
npm run e2e:screenshots
```

If you try to run the above command without setting up the Edge browser with protractor, then the script will fail.

## Documentation

Documentation for the client code and web API are included and available at the below URLs.

* [Angular Client](https://jonathan-s-phillips.github.io/my-tasks/angular-client/)
* [API](https://jonathan-s-phillips.github.io/my-tasks/server/)

Documentation for the client was built using [Compodoc](https://compodoc.app/) and documentation for the web API was built using [apiDoc](http://apidocjs.com/). Scripts are included to generate the documentation locally as well. You can run the following command which will update the docs directory with the latest changes from the source.

```
npm run doc
```

## Built With

* [Angular](https://angular.io/) - UI Components
* [Angular Material 2](https://material.angular.io/) - Material Design components
* [Font-Awesome](https://github.com/FortAwesome/Font-Awesome) - Icons
* [Express](https://github.com/expressjs/express) - web framework
* [TypeORM](https://github.com/typeorm/typeorm) - ORM for TypeScript
* [SQLite](https://github.com/mapbox/node-sqlite3) - DB driver
* [Compodoc](https://compodoc.app/) - Angular project documentation
* [apiDoc](http://apidocjs.com/) - API documentation

## Authors

* **[Jonathan Phillips]** - (https://github.com/Jonathan-S-Phillips)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

Prior to developing this app I had only worked with Angular, so it was an exciting challenge to learn how to set up and configure an Express API server. I also enjoyed learning about Docker containers and how to use Compose to define and run a multi-container Docker app. Also even though I have worked with Angular before, I was using a mix of Typescript, jQuery, and the Bootstrap UI framework. For the purposes of this app I decided to go with a solution built entirely in Typescript, which also gave me an opportunity to dive into Angular Material 2.
