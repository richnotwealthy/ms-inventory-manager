# Media Support Manager

An equipment management tool for members of the Media Support team at NYU Tandon.

## Setup for Development

You're going to need Node.js (and npm, it's package manager) setup on your machine in order to run the development environment locally. I don't care how you install Node, but I do recommend you use a package manager like homebrew or apt and pull the latest LTS version.

The database we're using is MySQL. This project is built with MySQL 5. SQL commands for populating the db can be found in the `/sql/` directory.

After cloning this package (and installing Node!), run the following:

```
# install dependencies
> npm install
# start the dev server
> npm run dev
```

The app will automatically open a new tab in Google Chrome at [http://localhost:3934/](http://localhost:3934/) where the app is running.

## Production build

To build this app into a static, minified package, running `npm start` will create such a package under the `/build/` directory and run the production server at [http://localhost:9000/](http://localhost:9000/).

### Environment Variables

Set these in the process environment to change things up quickly and easily for production.

**PORT** = expose the http server on this port

**DATABASE_URL** = the location and credentials for accessing the PostgreSQL db, (ex. 'mysql://root:password@localhost:3306/msim')

---

Made with the help of ejecting a [create-react-app](https://github.com/facebookincubator/create-react-app).
