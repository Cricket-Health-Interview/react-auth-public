const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');
const jwtSecret = require('./jwtSecret');

// pretend we have a real DB and not a mock app
const mongodb = require('mongo-mock');
mongodb.max_delay = 0;
const MongoClient = mongodb.MongoClient;

const PORT = 8080;

const startServer = async () => {
  const server = Hapi.server({ port: PORT, host: 'localhost' });

  // just like if we were actually using mongodb to connect
  const url = 'mongodb://localhost/react-auth';
  const client = await MongoClient.connect(url, {});
  const db = client.db();
  const User = db.collection('user');
  // Insert a fake user to log in with, if they don't yet exist
  if (!(await User.findOne({ username: 'user' }))) {
    await User.insert({ username: 'user', password: 'password' });
  }

  await server.register(require('hapi-auth-jwt2'));
  await server.register(require('@hapi/vision'));

  server.views({
    engines: {
      html: require('handlebars'),
    },
    relativeTo: __dirname,
    path: 'public',
  });

  server.auth.strategy('jwt-cookie', 'jwt', {
    key: jwtSecret,
    validate: () => ({ isValid: true }),
  });

  // Set up settings for the 'token' cookie
  server.state('token', {
    ttl: 365 * 24 * 60 * 60 * 1000,
    encoding: 'none',
    isSecure: false,
    isHttpOnly: true,
    clearInvalid: false,
    strictHeader: true,
    path: '/',
  });

  server.route([
    {
      method: 'GET',
      path: '/',
      handler: (_, h) => h.view('index'),
    },
    {
      method: 'POST',
      path: '/api/authenticate',
      handler: async (request, h) => {
        const { username, password } = request.payload;
        try {
          const user = await User.findOne({ username, password });

          if (!user) {
            console.error('Invalid authentication, user not found with matching username/password');
            return Boom.unauthorized('Invalid authentication');
          }

          const token = Jwt.token.generate({ username: user.username }, jwtSecret);
          return h
            .response()
            .state('token', token)
            .code(200);
        } catch (err) {
          console.error(err);
          return Boom.badImplementation(err);
        }
      },
    },
    {
      method: 'GET',
      path: '/api/cokeFormula',
      options: {
        auth: 'jwt-cookie',
      },
      handler: (_, h) => h.response({ message: 'The recipe for Coca Cola is Pepsi.' }),
    },
    {
      method: 'GET',
      path: '/api/home',
      handler: (_, h) => h.response('welcome!'),
    },
    {
      method: 'GET',
      path: '/logout',
      handler: (_, h) =>
        h
          .response()
          .unstate('token')
          .code(200),
    },
  ]);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

startServer();
