Template.dinner.helpers({

	breakFast: function()
	{
		//return Foods.find({$and : [{Activate: "Y"}, {Category: "Appetizer"}]},{sort: { WebId: 1 } });
		return Menu.find({Category: "Dinner"});
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
});