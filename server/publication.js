Meteor.publish('menu', function(){
	return Menu.find();
	}
	);	

Meteor.publish('home', function(){
	return Home.find({Activate: "Y"},{sort: { WebId: 1 } });
	}
	);	
	

Meteor.publish('cartItems', function(sessid){

	console.log("In Publish: sessid " + sessid );

	return  CartItems.find({session: sessid });

	}
	);	
	
	
	Meteor.publish('orders', function(){
	console.log("Count Order = " + Orders.find().count());
	return Orders.find();
	}
	);	
	