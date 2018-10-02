module.exports = {
  'secretKey': '12345-67890-09876-54321',
  'mongoUrl' : 'mongodb://localhost:27017/ringa',
  'facebook' : {
    clientID: '1690774367898305',
    clientSecret: '36f8f071090e18a2f8d9f3482c66497c',
    callbackURL: 'https://localhost:3443/users/facebook/callback'
  }
}
// this way of tracking configuration allows us to write our code such
// that there will only be one location where we need to make updates
