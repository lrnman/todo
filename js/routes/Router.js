(function() {
	app.TodoRouter = Backbone.Router.extend({
		routes: {
			//匹配任何描
	    	"*filter": "do",
	  	},
		do: function(param) {
			//记录描， 用于itemview
			app.todoFilter = param || '';
			app.todos.trigger('filter');
		}
	});
	
	app.router = new app.TodoRouter();
//	app.router.on('route:do', function(){
//		console.log('##');
//	});
	Backbone.history.start();
})();
