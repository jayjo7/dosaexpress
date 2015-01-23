Meteor.methods({

	addToCart:function(qty, product, session, name, category, charge){

		CartItems.update({product:product, session:session},{qty:qty, product:product, session:session, Name:name, Category:category, Charge:charge},{upsert:true});
		console.log("Added to CartItems: session = " + session + " product = " + product);

	},

	isInCart:function(product, session)
	{
			var result = false;
		    var itemFromCart = CartItems.findOne( { $and:[{product:product}, {session:session}]});
			if(itemFromCart)
			{
				
			//console.log("itemFromCart.count() = " +itemFromCart.length)

				for (var key in itemFromCart )
				{
					console.log("itemFromCart.key = " + itemFromCart[key]);
				}
			result= true;

			}

	}
	,
	removeCartItem:function(id){
		CartItems.remove({_id:id});
	},
		removeAllCartItem:function(sessionId){
		CartItems.remove({session:sessionId});
	},

	getOrder:function(sessionId){

		console.log("sessionId = " + sessionId);
		var order = Orders.findOne({UniqueId:sessionId});
		console.log("order = " + order);

		return order;

	},

	getNextSequenceValue: function (){
		
		try{

			        var currentId = Counters.findOne({},{sort:{orderNumber:-1}}) || 1;

			        	for(var key in currentId)
			        	{
			        		console.log(currentId[key]);
			        	}

        			var nextOrderumber= Number (currentId.orderNumber) + 1;
        			Counters.insert({orderNumber:nextOrderumber});
        			console.log(nextOrderumber);
        			return nextOrderumber;

        		}catch(error)
        		{
        			console.log(error);
        		}
   	
	},

	orderItems:function(sessionId, contactInfo){

			//console.log('sessionId= ' + sessionId);
			var order = {};
			order.Status='new';
			order.OrderNumber=Meteor.call('getNextSequenceValue');
			order.UniqueId=sessionId;

			var now =moment().format('MM/DD/YYYY hh:mm:ss A');

			console.log('now = ' + now);

			order.TimeOrderReceived = now;
			order.CustomerName=contactInfo.contactName;
			order.CustomerPhone=contactInfo.phoneNumber;
			order.CustomerEmail=contactInfo.email;
			order.MessageToKitchen = contactInfo.messageToKitchen;

			var itemString='';
			var items=[];

			//console.log("Order Object before loop" + JSON.stringify(order, null, 4));

			var itemsInCart= CartItems.find({session:sessionId});

			console.log('Number of items in cart for session ' + sessionId
				+ ', contact  ' + order.CustomerPhone + ' ' +order.CustomerEmail +' = ' + itemsInCart.count());

			var totalItemCount = 0;
			var subTotal = 0;

			itemsInCart.forEach (function (cartitems)

				{
					totalItemCount += Number(cartitems.qty);


					//console.log("cartitems.product = " + cartitems.product);
					var product = Menu.findOne({_id: cartitems.product});
    				//console.log("Product Name = " + product.Name);

					subTotal +=  (Number(product.Charge) * cartitems.qty);
					itemString = itemString + cartitems.qty + " - " + product.Name +'\n';
   					items.push(
   					{ 
        				"name" : product.Name,
        				"qty"  : cartitems.qty
					});

   			});
			order.itemsObject=items;
			order.Items= itemString.substring(0, itemString.length-1); // Substring to get rid of the last new character
			order.TotalItem = totalItemCount;	
			order.SubTotal = Number (subTotal.toFixed(2));
			order.Total = Number((subTotal + subTotal * .092).toFixed(2));

			order.sessionId =sessionId;



            console.log("Done Building the Order Object" + JSON.stringify(order, null, 4));

			var itemsToOrder = Orders.insert(order, function(error, _id)
				{

					if(error)
					{
						config.log("touble insert the order to mongodb " + order);
						throw new Meteor.Error(error);

					}
					else
					{
						Meteor.call('removeAllCartItem',sessionId);
						try{

							var https = Meteor.npmRequire('request');
							var options ={
								url:'https://script.google.com/macros/s/AKfycbwl0v0pHtBbwPHFy54QnHok5KpkHUVXnRO98sN_GzVPZ0pCdYu2/exec',
								method: 'POST',
								body: order,
								json: true,
								followAllRedirects: true

							}
						    https.post(options, function (error, response, body){
								console.log("error : " + error);
								console.log("response.statusCode : " + response.statusCode);
								console.log("body : " + body);

							});

							return order;
							//var result = HTTP.call(	'POST', 
							//						'https://script.google.com/macros/s/AKfycbzu3126b_QhgPwuwoStDdoF8AVqf2XFfAQ-ars_YmR7SEZgeSc/exec',
                           	//						{ data:order, followRedirects:true }
                           	//					);
							//var result = HTTP.call('GET', 'https://script.google.com/macros/s/AKfycbzu3126b_QhgPwuwoStDdoF8AVqf2XFfAQ-ars_YmR7SEZgeSc/exec');
							//console.log("result = " + result);
							//for (var key in result)
							//{
							//
							//	console.log("key = " +  key + " : " + result[key]);
							//}
						}catch (e)
						{
							console.log(e);
						}
						//return order.items;
					}
				});

	}
});