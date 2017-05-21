Vue.component('slide', {
  template: '<div  class="mui-slider" v-if="slide.length">'+
						  '<div class="mui-slider-group">'+
						    '<div class="mui-slider-item {{!$index && \'mui-active\'}}" v-for="item in slide">'+
						      '<a href="javascript:;" v-on:tap="openBiz(item.url)">'+
									'<img  :src="item.image" :alt="item.image">'+
							  '</a>'+
						    '</div>'+
						  '</div>'+
						  '<div class="mui-slider-indicator">'+
						    '<div class="mui-indicator {{!$index && \'mui-active\'}}"  v-for="item in slide"></div>'+
						  '</div>'+
						'</div>',
  props: ['slide'],
  methods:{
					openBiz:App.openWebView
	}
});