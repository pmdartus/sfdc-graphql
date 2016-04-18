import express from 'express';
import jsforce from 'jsforce';

const IN_DEV = process.env.ENV !== 'production';
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error('CLIENT_ID and CLIENT_SECRET should be set before starting the application');
}

const oauth2 = new jsforce.OAuth2({
  clientId : CLIENT_ID,
  clientSecret : CLIENT_SECRET,
  redirectUri : 'http://localhost:3000/callback'
});

const app = express();

app.use('/login', (req, res) => {
  return res.redirect(oauth2.getAuthorizationUrl({ scope : 'api id' }));
});

app.use('/callback', (req, res) => {
  var conn = new jsforce.Connection({ oauth2 : oauth2 });
  var code = req.params.code;

  conn.authorize(code, function(err, userInfo) {
    if (err)
      return console.error(err);

    console.log('Access Token', conn.accessToken);
    console.log('Refresh Token', conn.refreshToken);
    console.log('Instance Url', conn.instanceUrl);
  });
});

app.listen(3000);
console.log('GraphQL server running on http://localhost:3000/graphql');
