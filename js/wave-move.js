paper.install(window)
var playground = function()
{
	var that = this;
	
	this.init = function(selector)
	{
		// set up paper js for js use
		paper.setup(selector);
		
		// create a wave object
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
		// returns an instance of the wave
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
	this.tool = null;
	this.mul =1, 
	this.last_point = 0,
	
	this.create = function()
	{	
		// create a new path and tool
		that.path = new Path();
		that.tool = new Tool();
		that.tool.minDistance = 5;
		that.path.strokeColor = 'black';
		
		// add the path to the list of paths for the animations
		that.paths[that.total_paths] = that.path;
		that.total_paths++
			
		// set the limits of the speed
		var multiplier = 0.25, next_x_pos=0, next_y_pos=0;
		paper.view.onFrame = function(event)
		{ 
			// go through all existing paths to make them jiggle
			for (var a = 0; a < that.total_paths; a++) {
				try { 
					// Segments for this point
					var segments = that.paths[a].segments;
					// loop through all the point
					for (var i = 0, l = segments.length; i < l; i++) {
						
						// the point
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
					
					
				// adjust circle
				if(that.paths[a].circle !== undefined)
				{
					var last_point_in_segment = (segments[segments.length-1].point);
					that.paths[a].circle.position = new Point(last_point_in_segment.x,last_point_in_segment.y);
				}
					
					
				} catch (e) {}
				
			}
		}
		
		var mul = 1;
		
		var values = {
			curviness:0.5,
			distance: tool.minDistance,
			offset: 5,
			mouseOffset: true
		};
		that.tool.onMouseMove =  function(event)
		{ 
 			// Add a path
 			//that.path.add(event.event.pageX  , event.event.pageY +(30 * that.mul));
 			
 			var step = event.delta.rotate(90 * mul);
			
			if (!values.mouseOffset)
				step.length = values.offset;
			 
			var segment = new Segment(event.point.x + step.x, event.point.y + step.y);
			
		 	segment.handleIn = -( (event.delta.x* values.curviness,event.delta.y* values.curviness) );
		  	segment.handleOut =  ( (event.delta.x* values.curviness,event.delta.y* values.curviness) );
			
			that.path.add(segment);
			 
			mul *= -1;
 			
 			// get the latest point created and add the original x and y values
 			var latest_point = that.path.segments[that.path.segments.length-1].point;
 		
 			// create the custom x and y values
 			latest_point.original_x = latest_point.x;
 			latest_point.original_y = latest_point.y;
 			 
 			
 			// decide a random limit for each point. This will be from 0 to 15
 			latest_point.y_limit = Math.random()*15;
 			latest_point.x_limit = Math.random()*15;
 			 
 			// also add a varible to see if its a positive or negative number
 			latest_point.positive_y_direction = true;
 			latest_point.positive_x_direction = false;
 			// get the last point for deciding whether to create a up or down point
  			that.last_point =  event.event.pageX;
			if(that.mul == 1) { that.mul = -1; } else { that.mul = 1}	
			 
 			
		}
		var segment_name = 0;
		that.tool.onMouseDown =  function(event)
		{
			var current_path = that.paths[that.total_paths-1];
			var segments = current_path.segments;
			var last_point = segments[segments.length-1].point
			last_point.name = "point-"  + segment_name
			current_path.circle = new Path.Circle([last_point.original_x, last_point.original_y] , 40);
			current_path.circle.original_x = last_point.original_x
			current_path.circle.original_y = last_point.original_y
			current_path.circle.strokeColor = 'black';
			segment_name++;
			
			that.tool.remove();
	
			setTimeout(function() { that.create(); } , 500);
		}	
	}
}

jQuery(document).ready(function(){

	var nicolas_playground = new playground();
		nicolas_playground.init('playground');
});