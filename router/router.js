Router.configure({
  layoutTemplate: 'layout'
});

Router.onBeforeAction(function () {
  if (!Meteor.user() && !Meteor.loggingIn()) {
    this.redirect('/login');
  } else {
    this.next();
  }
}, {
  where: 'client',
  except: ['/login', 'api/users']
});

Router.plugin('dataNotFound', {notFoundTemplate: 'notFound'});

Router.route('/', function () {
  this.render('profilePage', {
    data: function () {
      console.log(Meteor.user());
      return Meteor.user();
    }
  });
});

Router.route('/login');

Router.route('/api/users/:_id', {where: 'server', name: 'api/users'})
  .get(function () {
    var _id = this.params._id;
    var user = Meteor.users.findOne({ _id: _id });
    sendJson(this.response, { success: true, data: user });
  })
  .put(function() {
    var _id = this.params._id;
    var user = this.request.body;
    var obj = {
      emails: [ {address: user.email} ],
      profile: user.profile
    }
    Meteor.users.update({ _id: _id }, { $set: obj });
    if(user.password) Accounts.setPassword(_id, user.password);
    sendJson(this.response, { success: true });
  })
  .delete(function() {
    var _id = this.params._id;
    var user = Meteor.users.findOne({_id: _id});
    sendJson(this.response, { success: true });
  });

Router.route('/api/users', {where: 'server'})
  .post(function () {
    var user = this.request.body;
    var res = this.response;
    Accounts.createUser({
      email: user.email,
      password: user.password,
      profile: {
        name: user.name
      }
    }, function () {
      sendJson(res, { success: true });
    });
  });