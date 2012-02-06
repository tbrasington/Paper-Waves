paper.install(window)
var playground = function()
{
	var that = this;
	
	this.init = function(selector)
	{
		// set up paper js for js use
		paper.setup(selector);
	
		var wave = that.make_wave()
		
			

			
	},
	/*
	* Creates a squiggle
	*
	*/
	this.make_wave = function()
	{
		var wave_1 = new wave();
			wave_1.creator = that;
			wave_1.create()
			
			return wave_1;
	}
}

var wave = function()
{
	var that = this;
	
	this.creator = null;
	
	this.paths = {};
	this.path = null;
	this.total_paths = 0;
	this.tool = new Tool();
	 
	this.curviness =  0.5,
	this.distance =10,
	this.offset = 10,
	this.mul =1, 
	this.mouseOffset = true,
	this.last_point = 0,
	this.count_limit = 0;
	
	this.create = function()
	{	
	
		var values = {
			friction: 0.8,
			timeStep: 0.01,
			amount: 15,
			mass: 2,
			count: 0
		};
		
		that.tool.minDistance = 10;
		
		that.tool.onMouseDown = function(event)
		{
			that.path = new Path();
			that.path.strokeColor = 'black';
			that.last_point = event.event.pageX;
			that.paths[that.total_paths] = that.path;
			that.total_paths++
			
		}	
			
		var multiplier = 1, next_x_pos=0, next_y_pos=0;
		paper.view.onFrame = function(event)
		{ 
			for (var a = 0; a < that.total_paths; a++) {
				try { 
					var segments = that.paths[a].segments;
					for (var i = 0, l = segments.length; i < l; i++) {
						
						var point = segments[i].point;
						
						// X positioning
						if(point.positive_x_direction)
						{
							next_x_pos =  point.x + multiplier;
							
							// if the x pos is greater than the original positioning and the limit of the point, set the direction in reverse
						 	if(next_x_pos>=(point.original_x + point.y_limit))
						 	{ 
						 		point.positive_x_direction = false;
							}
								else
							{
								point.x = next_x_pos
							}
							
						} 
							else 
						{ 
							// X positioning
							next_x_pos =  point.x - multiplier;
							
							// if the x pos is less than the original positioning and the limit of the point, set the direction in reverse
						 	if(next_x_pos <= (point.original_x - point.x_limit))
						 	{ 
						 		point.positive_x_direction = true;
							}
								else
							{	
								point.x = next_x_pos;
							}
						
						}
					
					// Y positioning
					if(point.positive_y_direction)
						{
							
							next_y_pos = point.y + multiplier;
							
							// if the x pos is greater than the original positioning and the limit of the point, set the direction in reverse
						 	if(next_y_pos>=(point.original_y + point.y_limit))
						 	{ 
						 		point.positive_y_direction = false;
							}
								else
							{
								point.y = next_y_pos
							}
						} 
							else 
						{ 
							
							
							// Y positioning
							next_y_pos =  point.y - multiplier;
							
							// if the y pos is less than the original positioning and the limit of the point, set the direction in reverse
						 	if(next_y_pos <= (point.original_y - point.y_limit))
						 	{ 
						 		point.positive_y_direction = true;
							}
								else
							{	
								point.y = next_y_pos;
							}
							
						}
					}
						
				} catch (e) {}
			}
		}
				
		that.tool.onMouseDrag =  function(event)
		{ 
			
 			that.path.add(event.event.pageX  , event.event.pageY +(30 * that.mul));
 			// get the latest point created and add the original x and y values
 			var latest_point = that.path.segments[that.path.segments.length-1].point;
 			// create the custom x and y values
 			latest_point.original_x = latest_point.x;
 			latest_point.original_y = latest_point.y;
 			latest_point.y_limit = Math.random()*15;
 			latest_point.x_limit = Math.random()*15;
 			// also add a varible to see if its a positive or negative number
 			latest_point.positive_y_direction = true;
 			latest_point.positive_x_direction = false;
 			// get the last point for deciding whether to create a up or down point
  			that.last_point =  event.event.pageX;
			if(that.mul == 1) { that.mul = -1; } else { that.mul = 1}
			 
		}
		
	}
}

jQuery(document).ready(function(){

	var nicolas_playground = new playground();
		nicolas_playground.init('playground');
	

});