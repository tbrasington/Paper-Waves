paper.install(window)
var playground = function()
{
	var that = this;
	
	this.init = function(selector)
	{
		paper.setup(selector);
	
		that.rebuild()
			
	},
	
	this.rebuild = function()
	{
		var squiggle_1 = new squiggle();
			squiggle_1.creator = that;
			squiggle_1.create()
	}
}

var squiggle = function()
{
	var that = this;
	
	this.creator = null;
	
	this.path = new Path();
	
	this.tool = new Tool();
	
	this.smooth_interval = null;
	
	this.create = function()
	{
		that.tool.fixedDistance = 10;
		that.path.strokeColor = 'black';
		that.tool.onMouseMove = function(event)
		{
			that.path.add(event.point);
			
			// After the event has moved a 100 times, remove the event
			if(that.tool._count>100)
			{
				that.tool.remove();
			
				// Get the creator of the squiggle to create a new squiggle
				setTimeout(function() { 
				that.creator.rebuild(); 
				},1000);
			}
		}
		
		// make it smooth every 200ms
		that.smooth_interval = setInterval(function() { that.path.simplify(); } , 200);
	}
}

jQuery(document).ready(function(){

	var nicolas_playground = new playground();
		nicolas_playground.init('playground');
	

});