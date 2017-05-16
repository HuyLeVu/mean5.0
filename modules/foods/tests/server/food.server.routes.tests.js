'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Food = mongoose.model('Food'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  food;

/**
 * Food routes tests
 */
describe('Food CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Food
    user.save(function () {
      food = {
        name: 'Food name'
      };

      done();
    });
  });

  it('should be able to save a Food if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Food
        agent.post('/api/foods')
          .send(food)
          .expect(200)
          .end(function (foodSaveErr, foodSaveRes) {
            // Handle Food save error
            if (foodSaveErr) {
              return done(foodSaveErr);
            }

            // Get a list of Foods
            agent.get('/api/foods')
              .end(function (foodsGetErr, foodsGetRes) {
                // Handle Foods save error
                if (foodsGetErr) {
                  return done(foodsGetErr);
                }

                // Get Foods list
                var foods = foodsGetRes.body;

                // Set assertions
                (foods[0].user._id).should.equal(userId);
                (foods[0].name).should.match('Food name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Food if not logged in', function (done) {
    agent.post('/api/foods')
      .send(food)
      .expect(403)
      .end(function (foodSaveErr, foodSaveRes) {
        // Call the assertion callback
        done(foodSaveErr);
      });
  });

  it('should not be able to save an Food if no name is provided', function (done) {
    // Invalidate name field
    food.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Food
        agent.post('/api/foods')
          .send(food)
          .expect(400)
          .end(function (foodSaveErr, foodSaveRes) {
            // Set message assertion
            (foodSaveRes.body.message).should.match('Please fill Food name');

            // Handle Food save error
            done(foodSaveErr);
          });
      });
  });

  it('should be able to update an Food if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Food
        agent.post('/api/foods')
          .send(food)
          .expect(200)
          .end(function (foodSaveErr, foodSaveRes) {
            // Handle Food save error
            if (foodSaveErr) {
              return done(foodSaveErr);
            }

            // Update Food name
            food.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Food
            agent.put('/api/foods/' + foodSaveRes.body._id)
              .send(food)
              .expect(200)
              .end(function (foodUpdateErr, foodUpdateRes) {
                // Handle Food update error
                if (foodUpdateErr) {
                  return done(foodUpdateErr);
                }

                // Set assertions
                (foodUpdateRes.body._id).should.equal(foodSaveRes.body._id);
                (foodUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Foods if not signed in', function (done) {
    // Create new Food model instance
    var foodObj = new Food(food);

    // Save the food
    foodObj.save(function () {
      // Request Foods
      request(app).get('/api/foods')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Food if not signed in', function (done) {
    // Create new Food model instance
    var foodObj = new Food(food);

    // Save the Food
    foodObj.save(function () {
      request(app).get('/api/foods/' + foodObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', food.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Food with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/foods/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Food is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Food which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Food
    request(app).get('/api/foods/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Food with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Food if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Food
        agent.post('/api/foods')
          .send(food)
          .expect(200)
          .end(function (foodSaveErr, foodSaveRes) {
            // Handle Food save error
            if (foodSaveErr) {
              return done(foodSaveErr);
            }

            // Delete an existing Food
            agent.delete('/api/foods/' + foodSaveRes.body._id)
              .send(food)
              .expect(200)
              .end(function (foodDeleteErr, foodDeleteRes) {
                // Handle food error error
                if (foodDeleteErr) {
                  return done(foodDeleteErr);
                }

                // Set assertions
                (foodDeleteRes.body._id).should.equal(foodSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Food if not signed in', function (done) {
    // Set Food user
    food.user = user;

    // Create new Food model instance
    var foodObj = new Food(food);

    // Save the Food
    foodObj.save(function () {
      // Try deleting Food
      request(app).delete('/api/foods/' + foodObj._id)
        .expect(403)
        .end(function (foodDeleteErr, foodDeleteRes) {
          // Set message assertion
          (foodDeleteRes.body.message).should.match('User is not authorized');

          // Handle Food error error
          done(foodDeleteErr);
        });

    });
  });

  it('should be able to get a single Food that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Food
          agent.post('/api/foods')
            .send(food)
            .expect(200)
            .end(function (foodSaveErr, foodSaveRes) {
              // Handle Food save error
              if (foodSaveErr) {
                return done(foodSaveErr);
              }

              // Set assertions on new Food
              (foodSaveRes.body.name).should.equal(food.name);
              should.exist(foodSaveRes.body.user);
              should.equal(foodSaveRes.body.user._id, orphanId);

              // force the Food to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Food
                    agent.get('/api/foods/' + foodSaveRes.body._id)
                      .expect(200)
                      .end(function (foodInfoErr, foodInfoRes) {
                        // Handle Food error
                        if (foodInfoErr) {
                          return done(foodInfoErr);
                        }

                        // Set assertions
                        (foodInfoRes.body._id).should.equal(foodSaveRes.body._id);
                        (foodInfoRes.body.name).should.equal(food.name);
                        should.equal(foodInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Food.remove().exec(done);
    });
  });
});
