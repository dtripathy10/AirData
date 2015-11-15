
function Tree() {
	this.root = null;
	this.id  =  0;
}

Tree.prototype = {


	constructor: Tree,
	

	add: function(data,parent_node) {
		var node = {
			"id": this.id,
			"child" : [],
			"data" : data,
			"level" : null,
			"render_node":null,
			"attr": { 
				"font-family": "arial",
				"fill": "red",
				"font-size": 12
			}
		};
		this.id += 1;
		if(parent_node === null) {
			node.parent = null;
			node.level = 0;
			this.root = node;
		}else {
			node.parent = parent_node;
			node.level = node.parent.level + 1;
			node.parent.child.push(node);
		}
		return node;
	},


	traverse_level: function(process) {
		
		var level = [],
				parent = this.root,
				queue = [];

		queue.push(this.root);

		if(!level[parent.level]) {
			level[parent.level] = [];
		}

		level[parent.level].push(parent);
		
		var node;

		while(node = queue.shift()) {
			for(var i = 0; i < node.child.length ; i++) {
				queue.push(node.child[i]);
				if(!level[node.child[i].level]) level[node.child[i].level] = [];
				level[node.child[i].level].push(node.child[i]);
			}
		}

		for(var temp_level in level) {
			process.call(this, level[temp_level]);
		}
	},


	
	traverseDFS: function(process) {
		
		var stack = [],
			temp_node,
			c_1,
			temp_queue;

		stack.push(this.root);

		while(temp_node = stack.pop()) {
			for (c_1 = 0; c_1 < temp_node.child.length; c_1++) {
				stack.push(temp_node.child[c_1]);
			}
			process.call(this, temp_node);
		}
	},
	

	traverse: function(process) {
		var queue,
				temp_node,
				c_1;

		queue = [];
		queue.push(this.root);
		while(temp_node = queue.shift()) {
			for (c_1 = 0; c_1 < temp_node.child.length; c_1++) {
				queue.push(temp_node.child[c_1]);
			}
			//call the process method on this node
			process.call(this, temp_node);
		}
	},

			
	initialize: function(object) {
		
		if(_.isEmpty(object)) {
			return false;
		}
		
		
		var isFirstNode = true,
				queue = [],
				parent = null,
				nextQueueNode = null,
				node = null,
				nextDataNodeArray,
				self = this;
		
		do {
			if(isFirstNode) {
				nextDataNodeArray = sortByType(object);
			}else {
				nextDataNodeArray = sortByType(nextQueueNode.data.value);
			}
			
			for(var i = 0; i < nextDataNodeArray.length; i++) {
				var value = nextDataNodeArray[i];
				//check if it is first node(if yes, then parent node)
				//and in first iteration it will execute first
				if(i == 0) {
					if(isFirstNode) {
						node = {};
						node.name = "Overview";
						node.value = value.value;
						parent = this.add(node,null);
						isFirstNode = false;
					}else {
						parent = nextQueueNode;
					}
					continue;
				}

				if(value.key == "CcyGrpBalance") {
					continue;
				}
				if (_.isArray(value.value)) {	
					_.forEach(value.value, function(data) {
						node = {};
						node.name = value.key;
						node.value = data;
						queue.push(self.add(node,parent));
					});
				} 
			}
			nextQueueNode = queue.shift(); 
		}while(nextQueueNode);
		
		return true;

	},



			render: function(object,container) {

				$("#tree_view").empty();
				var result = this.initialize(object);
				if(!result) return;


		//calculate the x and y position of each tree node
		var level = [];
		var parent = this.root;
		var queue = [];
		queue.push(parent);
		if(!level[parent.level]) level[parent.level] = [];
		level[parent.level].push(parent);
		var node;
		while(node = queue.shift()) {
			for(var i = 0; i < node.child.length ; i++) {
				queue.push(node.child[i]);
				if(!level[node.child[i].level]) level[node.child[i].level] = [];
				level[node.child[i].level].push(node.child[i]);
			}
		}
		//think like a grid
		var depthOfTree = level.length;
		var gapBetweenLevel = 180;
		var gapBetweenNode = 20;
		var widthOfRectangle = 210;
		var heightOfRectangle = 120;
		
		var levelX = [];
		
		for(var i = level.length - 1; i >= 0; i-- ) {
			levelX[i] = 100;
		}
		
		for(var counter = level.length-1; counter >= 0; counter-- ) {
			
			var intermediateLeafChild = [];
			for(var counter1 = 0; counter1 < level[counter].length; counter1++ ) {
				//for child node level[counter][counter1].child.length = 0
				if(level[counter][counter1].child.length == 0) {
					if(level[counter][counter1].level == level.length-1) {
						level[counter][counter1].attr.x = levelX[counter];
						levelX[counter] = level[counter][counter1].attr.x + gapBetweenNode + widthOfRectangle;
					}else {
						//do something
						intermediateLeafChild.push(level[counter][counter1]);
					}
				}else {
					if(level[counter][counter1].child.length == 1) {
						level[counter][counter1].attr.x = level[counter][counter1].child[0].attr.x;
						levelX[counter] = level[counter][counter1].attr.x + gapBetweenNode + widthOfRectangle;
					}else {
						// calculating the centroid
						var centroid = 0;
						var minX, maxX;
						
						minX = level[counter][counter1].child[0].attr.x;
						maxX = level[counter][counter1].child[0].attr.x;
						for(var kk = 1; kk < level[counter][counter1].child.length; kk++) {
							if(minX > level[counter][counter1].child[kk].attr.x) minX = level[counter][counter1].child[kk].attr.x;
							if(maxX < level[counter][counter1].child[kk].attr.x) maxX = level[counter][counter1].child[kk].attr.x;
						}
						centroid = ((maxX + widthOfRectangle) - minX)/2;
						
						level[counter][counter1].attr.x = centroid + minX - (widthOfRectangle/2);
						levelX[counter] = level[counter][counter1].attr.x + gapBetweenNode + widthOfRectangle;
					}
				}
				//determine y axis of a node. It is good practice (visually appealing) to place the node
				//of same level in same row.
				level[counter][counter1].attr.y = level[counter][counter1].level  * gapBetweenLevel;
				//specify width and height
				level[counter][counter1].attr.width = widthOfRectangle;
				level[counter][counter1].attr.height = heightOfRectangle;
			}
			//caculate for intermediate leaf child
			for(var iii = 0; iii < intermediateLeafChild.length; iii++ ) {
				//levelX[counter]
				intermediateLeafChild[iii].attr.x = levelX[counter];
				levelX[counter] = intermediateLeafChild[iii].attr.x  + gapBetweenNode + widthOfRectangle;
			}
		}

		// write logic to decide height and width of paper. Now the logic is static
		var h = (depthOfTree * (gapBetweenLevel + heightOfRectangle) + 100) - $('.container').height();
		
		var maxWidth;
		maxWidth = levelX[0];
		for(var iiiii =  1; iiiii < level.length; iiiii++ ) {
			if(maxWidth < levelX[iiiii]) {
				maxWidth = levelX[iiiii];
			}
		}		

		if(maxWidth > $('.tree_view').width()) {
			w = maxWidth;
		}else {
			w = $('.tree_view').width() - 30;
		}
		var paper = Raphael("tree_view",w,h);
		
		
		this.traverse(function(node) {
			rect = paper.rect(node.attr.x, node.attr.y, node.attr.width, node.attr.height, 20);
			rect.node.id = 'myID_' + node.attr.x + node.attr.y; 
			if(node.data.name === "Account") {
				rect.attr({ fill: "#b1c9ed" , opacity: 1});
			}else if(node.data.name === "ParticipantDtls"){
				rect.attr({ fill: "#E6E6E6", opacity: 1});
			}else if(node.data.name === "Overview"){
				rect.attr({ fill: "#edb1b1", opacity: 1});
			}else {
				rect.attr({ fill: "#E6E6E6", opacity: 1});
			}
			rect.data("node", node)
			rect.dblclick(function () {
				console.log(printData(this.data("node")));
			});
			node.render_node = rect;
			
			var text1 = paper.text(node.attr.x + 10, node.attr.y + 60, printData(node));
			text1.attr({ "font-family": "Arial, Helvetica, sans-serif", fill: "#000", "font-size": 12 , "text-anchor":"start"});
			text1.data("node", node)
			
		});
		
		this.traverse(function(node) {
					//find child node
					var gap_between_dummy_down = gapBetweenLevel - 20;
					var gap_between_dummy_up = 20;
					
					var s_line = [];
					var root = null;
					if(node.child.length == 0) return;
					
					if( node.child.length == 1) {
						paper.connection(node.render_node,node.child[0].render_node, "#000");
						return;
					}
					
					dummy_node = paper.rect(node.attr.x + (node.attr.width/2) - 1, node.attr.y + gap_between_dummy_down , 2, 2);
					dummy_node.attr({ fill: "#000"});
					root = dummy_node;
					paper.connection(node.render_node,dummy_node, "#000");
					
					for(var i = 0; i < node.child.length; i++) {

						dummy_node = paper.rect(node.child[i].attr.x + (node.child[i].attr.width/2) - 1, node.child[i].attr.y - gap_between_dummy_up,2, 2);
						dummy_node.attr({ fill: "#000"});
						s_line.push(dummy_node);
						paper.connection(node.child[i].render_node,dummy_node, "#000");
					}
					
					for(var i = 0; i < s_line.length ; i++) {
						if( s_line.length == 1) {
							break;
						}
						paper.connection(root,s_line[i], "#000");
					}
				});

}
}
/////////////////////// Helper Method //////////////////////////////////////////////////


/*
	purpose: draw line between 2 raphael element such as circle or rectangle
	*/
	Raphael.fn.connection = function (obj1, obj2, line, bg) {
		if (obj1.line && obj1.from && obj1.to) {
			line = obj1;
			obj1 = line.from;
			obj2 = line.to;
		}
		var bb1 = obj1.getBBox(),
		bb2 = obj2.getBBox(),
		p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
		{x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
		{x: bb1.x - 1, y: bb1.y + bb1.height / 2},
		{x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
		{x: bb2.x + bb2.width / 2, y: bb2.y - 1},
		{x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
		{x: bb2.x - 1, y: bb2.y + bb2.height / 2},
		{x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
		d = {}, dis = [];
		for (var i = 0; i < 4; i++) {
			for (var j = 4; j < 8; j++) {
				var dx = Math.abs(p[i].x - p[j].x),
				dy = Math.abs(p[i].y - p[j].y);
				if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
					dis.push(dx + dy);
					d[dis[dis.length - 1]] = [i, j];
				}
			}
		}
		if (dis.length == 0) {
			var res = [0, 4];
		} else {
			res = d[Math.min.apply(Math, dis)];
		}
		var x1 = p[res[0]].x,
		y1 = p[res[0]].y,
		x4 = p[res[1]].x,
		y4 = p[res[1]].y;
		dx = Math.max(Math.abs(x1 - x4) / 2, 10);
		dy = Math.max(Math.abs(y1 - y4) / 2, 10);
		var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
		y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
		x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
		y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
		var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
		if (line && line.line) {
			line.bg && line.bg.attr({path: path});
			line.line.attr({path: path});
		} else {
			var color = typeof line == "string" ? line : "#000";
			return {
				bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
				line: this.path(path).attr({stroke: color, fill: "none"}),
				from: obj1,
				to: obj2
			};
		}
	};

/*
	purpose: give a random number between 2 number
	*/
	function randomInt(min,max){
		return Math.floor(Math.random()*(max-(min+1))+(min+1));
	}

/*
	purpose: give the first key of object
	*/
	function getFirstKey(object) {
		var first_key;
		for (first_key in object) break;
			return first_key;
	}

/*
	purpose: to check if a variable is object or not
	*/
	function isObject(object) {
		if(object === null) {
			return false;
		}
		if(typeof object === "undefined") {
			return false;
		}
		if(typeof object === "object") {
			return true;
		}else {
			return false;
		}
	}

/*
	purpose:  to check if a variable is array or not
	*/
	function isArray(object) {
		if(object === null) {
			return false;
		}
		if(typeof object === "undefined") {
			return false;
		}
		if(object instanceof Array) {
			return true;
		}else {
			return false;
		}
	}
	
	function sortByType(object) {
		var key, 
		sortedObject = [],
		primitiveType = {};
		
		
		for(key in object) {
			if(!isArray(object[key]) && !isObject(object[key])) {
				primitiveType[key] = object[key];
			}
		}
		sortedObject.push({ "key" : key,
			"value" : primitiveType,
			"type" : "primitive"
		});
		
		for(key in object) {
			if(isArray(object[key])) {
				sortedObject.push({ "key" : key,
					"value" : object[key],
					"type" : "array"
				});
			}
		}
		for(key in object) {
			if(isObject(object[key]) && !isArray(object[key])) {
				sortedObject.push({ "key" : key,
					"value" : object[key],
					"type" : "composite"
				});
			}
		}
		return sortedObject;
	}
	
/*
	purpose:  pretty print object. discard the array and composite object
	*/
	function pretty_print(object) {
		var key, re_object;
		re_object = {};
		for(key in object) {
			if(!isArray(object[key]) && !isObject(object[key])) {
				re_object[key] = object[key];
			}
		}
		return re_object;
	}
	
	/*
 purpose: data formatter for pool-structure tree box view
 
 Input: Expect node type: Overview(Root Pool), Account, ParticipantDtls(1st sub-pool), SubPool
 
 Output: return a string with key value pair and divider is newline. recommended data format
 for pool-structure tree box view
 	*/
 function printData(node) {
 	var data = "";
 	if(node.data.name === "Overview") {
 		data += "Pool ID :  " + node.data.value["PoolName"] + "\n";
 		data += "Start Date :  " + node.data.value["StartDt"] + "\n";
 		data += "Opening  Bal. :  " + node.data.value["YClsoingBal"] + "\n";
 		data += "Booked Bal.:  " + node.data.value["BookedBal"] + "\n";
 		data += "Value Bal.:  " + node.data.value["ValDtBal"] + "\n";
 		data += "OD Limit :  " + node.data.value["ODLimit"] + "\n";
		//data += "ODLimit :  " + node.data.value["ODLimit"] + "\n";
		return data;
	}
	if(node.data.name === "Account") {
		data += "Account No.:  " + node.data.value["PoolAcctNo"] + "\n";
		data += "Fx Rate :  " + node.data.value["FXRt"] + "\n";
		data += "Limit :  " + node.data.value["Limit"] + "\n";
		data += "Booked Bal.:  " + node.data.value["BookBal"] + "\n";
		data += "Value Bal.:  " + node.data.value["ValueBal"] + "\n";
		data += "Book Bal Pool Ccy :  " + node.data.value["BookBalBaseCcy"] + "\n";
		data += "Value Bal Pool Ccy :  " + node.data.value["ValueBalBaseCcy"] + "\n";
		return data;
	}
	if(node.data.name === "ParticipantDtls") {
		data += "Sub Pool ID. :  " + node.data.value["PoolAcctNo"] + "\n";
		//data += "Country :  " + node.data.value["Country"] + "\n";
		//data += "TP :  " + node.data.value["TP"] + "\n";
		data += "Fx Rate :  " + node.data.value["FXRt"] + "\n";
		data += "Limit :  " + node.data.value["Limit"] + "\n";
		data += "Booked Bal.:  " + node.data.value["BookBal"] + "\n";
		data += "Value Bal.:  " + node.data.value["ValueBal"] + "\n";
		return data;
	}
	if(node.data.name === "SubPool") {
		data += "Sub Pool ID. :  " + node.data.value["PoolAcctNo"] + "\n";
		//data += "Country :  " + node.data.value["Country"] + "\n";
		//data += "TP :  " + node.data.value["TP"] + "\n";
		data += "Fx Rate : " + node.data.value["FXRt"] + "\n";
		data += "Limit :  " + node.data.value["Limit"] + "\n";
		data += "Booked Bal.: " + node.data.value["BookBal"] + "\n";		
		data += "Value Bal.: " + node.data.value["ValueBal"] + "\n";
		return data;
	}
}

/*
	purpose: call application logic when dom is loaded
	*/
	window.onload = function () {
		var tree = new Tree();
		var object = strVar;
		tree.render(object["Overview"]);var account = { active: true, codes: [48348, 28923, 39080], city: "London" };
		$('#print').html(library.json.prettyPrint(object));
	};




	var populateArray = function(object) {
		var temp_row;
	// assign value according to key
	
	
	temp_row = {
		row_type : object.row_type,
		id : object.PoolAcctNo,
		country : object.Country,
		type : object.Country,
		nick_name : object.NickName,
		account_holder_name : object.PoolAccountName,
		ccy : object.Ccy,
		limit : object.Limit,
		booked_balance : object.Country,
		exchange_rate : object.FXRt,
		bb_base_currency : object.Country,
		ul_base_currency : object.Country,
		aamo_with_base_currency : object.Country
	};
	t_pool_structures.push(temp_row);
}

if (!library)
	var library = {};

library.json = {
	replacer: function(match, pIndent, pKey, pVal, pEnd) {
		var key = '<span class=json-key>';
		var val = '<span class=json-value>';
		var str = '<span class=json-string>';
		var r = pIndent || '';
		if (pKey)
			r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
		if (pVal)
			r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
		return r + (pEnd || '');
	},
	prettyPrint: function(obj) {
		var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
			return JSON.stringify(obj, null, 3)
			.replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
			.replace(/</g, '&lt;').replace(/>/g, '&gt;')
			.replace(jsonLine, library.json.replacer);
		}
	};

