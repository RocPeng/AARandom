$(function(){
 	var vm = new Vue({
			el: 'body',
		data:{
    		items:[],
    		adSlides:[]
    	},
    	computed: {
		    bizs: function () {
		        var bizArr = [];
		        this.items.forEach(function(n){
		        	n.businesses.forEach(function(m){
		        		bizArr.push(m);
		        	});
		        });
		      return bizArr;
		    }
		},
		methods:{
			openBiz:App.openWebView
		}
	});
	
	var options = {
		onBeforeRender :function(vm, rs){
			var hidden = document.querySelector('.mui-hidden');
			hidden && hidden.classList.remove('mui-hidden');
		},
		onRender:function(vm, rs){
			vm.items.length = 0;
			rs.bizGroups.forEach(function(n){
				vm.items.push(n);
			});
        	vm.adSlides.length = 0;
        	rs.adSlides.forEach(function(n){
        		vm.adSlides.push(n);
        	});
		},
		onAfterRender:function(vm, rs){
			setTimeout(function(){
        		mui('.mui-slider').slider();
        	},100); 
		}
	}
	var render = new App.Render('workbench',vm,options);
	render.bind();
	mui('.mui-scroll-wrapper').scroll();
});
