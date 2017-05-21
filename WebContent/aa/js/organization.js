$(
	function() {
		//init Spacetree
		//Create a new ST instance
		var st = new $jit.ST({
			//id of viz container element
			injectInto: 'infovis',
			//set duration for the animation
			duration: 700,
			//constrained:false,
			levelsToShow: 2,
			//set animation transition type
			transition: $jit.Trans.Quart.easeInOut,
			//set distance between node and its children
			levelDistance: 30,
			offsetX: 100,
			offsetY: 300,
			//enable panning
			Navigation: {
				enable: true,
				type: 'auto',
				panning: false, //true, 'avoid nodes'  
				zooming: false
			},
			/*Tree:{
        	subtreeOffset: 1,  
  				siblingOffset: 5,
        },*/
			orientation: "top",
			//set node and edge styles
			//set overridable=true for styling individual
			//nodes or edges
			Node: {
				height: 45,
				width: 60,
				type: 'rectangle',
				//color: '#aaa',
				overridable: true
					//autoHeight:true,
					//autoWidth:true
			},
			Canvas: {
				type: '2D'
			},

			Edge: {
				type: 'bezier',
				overridable: true
			},

			Label: {
				type: 'HTML', //'SVG', 'Native','HTML'  
				enable: true,
				stylesHover: {
					dim: 30,
					color: '#fcc'
				},
				duration: 100
			},
			onBeforeCompute: function(node) {},

			onAfterCompute: function() {},

			//This method is called on DOM label creation.
			//Use this method to add event handlers and styles to
			//your node.
			onCreateLabel: function(label, node) {
				label.id = node.id;
				label.innerHTML = node.name;
				label.onclick = function() {
					st.onClick(node.id);
				};
				//set label styles
				var style = label.style;
				style.width = 50 + 'px';
				style.height = 20 + 'px';
				style.cursor = 'pointer';
				style.color = '#333';
				style.fontSize = '0.8em';
				style.textAlign = 'center';
				style.paddingTop = '3px';
			},

			//This method is called right before plotting
			//a node. It's useful for changing an individual node
			//style properties before plotting it.
			//The data properties prefixed with a dollar
			//sign will override the global node style properties.
			onBeforePlotNode: function(node) {
				//add some color to the nodes in the path between the
				//root node and the selected node.
				if(node.selected) {
					node.data.$color = "#ff7";
				} else {
					delete node.data.$color;
					//if the node belongs to the last plotted level
					if(!node.anySubnode("exist")) {
						//count children number
						var count = 0;
						node.eachSubnode(function(n) {
							count++;
						});
						//assign a node color based on
						//how many children it has
						node.data.$color = ['#aaa', '#baa', '#caa', '#daa', '#eaa', '#faa'][count];
					}
				}
			},

			//This method is called right before plotting
			//an edge. It's useful for changing an individual edge
			//style properties before plotting it.
			//Edge data proprties prefixed with a dollar sign will
			//override the Edge global style properties.
			onBeforePlotLine: function(adj) {
				if(adj.nodeFrom.selected && adj.nodeTo.selected) {
					adj.data.$color = "red";
					adj.data.$lineWidth = 3;
				} else {
					delete adj.data.$color;
					delete adj.data.$lineWidth;
				}
			}
		});

		UmsApp.view.onLoad(function(evt, data) {
			if(data.length)
				data.forEach(function() {
					if(!data.id)
						data.id = data.departId;
				});
			st.loadJSON(data);
			st.compute();
			st.onClick(st.root);
		});

		//browser test
		if(!UmsApp.isUmsapp()) {
			$.getJSON('../mock/contact-structure.json', function(rs) {
				UmsApp.receive('umsapp://data/load', rs);
			});
		}
	}
);