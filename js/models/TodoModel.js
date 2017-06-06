(function (){
	app.TodoModel = Backbone.Model.extend({
		defaults: {
			title: "",
			isCompleted: false
		},
		
		toggle: function (){
			this.save({isCompleted: !this.get('isCompleted')});
		},
	});
//	console.log(new app.TodoModel({title: "aaa"}).toJSON());
})();
