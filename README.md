# CloudAnswers Salesforce Project Starter

CloudAnswers standard build script for our projects

Depends on the following environment variables:

    USERNAME=your username
    PASSWORD=your pass + token
    SERVER_URL=https://login.salesforce.com for dev orgs
    PACKAGE=name of package

Recommendations:

-   Use Prettier for code formatting so diffs are cleaner: https://prettier.io/

Includes:

-   static analysis code scanning via pmd
-   basic ant scripts for deploying and getting code from salesforce org
-   scripts to publish managed package version

Todo:

-   lightning component
-   dx deploys with different org shapes
-   test deploy
-   apex unit testing
-   ui testing

Usage:

-   fork this repo
-   `git clone <your new repo>`
-   make a .env file with your environment vars
-   `npm install`
-   code stuff
-   `nf run ant refresh` to get your metadata
-   commit to your repo
