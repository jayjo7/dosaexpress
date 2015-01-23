Template.breakFast.helpers({

	breakFast: function()
	{
		//return Foods.find({$and : [{Activate: "Y"}, {Category: "Appetizer"}]},{sort: { WebId: 1 } });
		return Menu.find({Category: "Breakfast"});
	}
	,

    currency: function(num)
    {
        return '$' + Number(num).toFixed(2);
    },

    isAvailable: function(Availability)
    {
    	if(Availability==='SoldOut')
    		return false;
    	else
    		return true;
    },

    soldOut:function(Availability)
    {
    	if(Availability==='SoldOut')
    		return 'soldout';
    	else
    		return '';
    },

    isInCart:function(product)
    {
    	var sessid = Meteor.default_connection._lastSessionId;
    	return Meteor.call('isInCart', product, sessid);
    }
});

Template.breakFast.events({
	'click .addcart': function(evt,tmpl)
	{
		var currentTarget = evt.currentTarget
		console.log("tmpl" + tmpl);
		console.log("this.UniqueId " + this.UniqueId );
		var product = this.UniqueId ;
		var sessid = Meteor.default_connection._lastSessionId;
		console.log("product = " + product );
		console.log("sessid = " + sessid );
		Meteor.call('addToCart', 1 ,product, sessid, this.Name, this.Category, this.Charge);
		evt.currentTarget.className = " fa fa-check btn btn-success";
		evt.currentTarget.title='Added'
	}
});