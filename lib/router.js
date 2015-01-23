Router.configure({

	layoutTemplate: 'layout',

	waitOn: function(){

		return Meteor.subscribe('menu'); 
	}





});

Router.route('/', {name: 'menu'});
//Router.route('/menu', {name: 'menu'} );