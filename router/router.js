Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/login', function () {
  this.render('loginPage');
});
