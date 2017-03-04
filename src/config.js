require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  mongoUrl: process.env.MONGOURL || 'mongodb://localhost',
  auth: {
    sessionSecret: process.env.sessionSecret || 'secret',
    strategies: {
      facebook: {
        clientID: '245136512561568',
        clientSecret: '32c36c55f736e6696224c3fbd2e6dcf2',
      },
      google: {
        clientID: '267913052637-0gh3nqug5q2m6tm1pld3u7rnh1d3ijp4.apps.googleusercontent.com',
        clientSecret: '9zSpL1g811PW4fkfzCNIxVFO',
      }
    }
  },
  app: {
    title: 'realUmls',
    description: 'web app for collaborative building diagrams',
    head: {
      titleTemplate: 'realUmls: %s',
      meta: [
        {name: 'description', content: 'realUmls'},
        {charset: 'utf-8'},
        {property: 'og:site_name', content: 'realUmls'},
        {property: 'og:image', content: 'https://react-redux.herokuapp.com/logo.jpg'},
        {property: 'og:locale', content: 'en_US'},
        {property: 'og:title', content: 'realUmls'},
        {property: 'og:description', content: 'realUmls'},
        {property: 'og:card', content: 'summary'},
        {property: 'og:site', content: 'realUmls'},
        {property: 'og:creator', content: 'realUmls'},
        {property: 'og:image:width', content: '200'},
        {property: 'og:image:height', content: '200'}
      ]
    }
  }
}, environment);
