Router.configure({

	layoutTemplate: 'layout',

	waitOn: function(){

		return Meteor.subscribe('menu'); 
	}





});

Router.route('/', {name: 'home'});
Router.route('/menu', {name: 'menu'} );