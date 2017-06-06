(function (){
	app.TodoCollection = Backbone.Collection.extend({
		//此属性来指定集合中包含的模型类
		model: app.TodoModel,
		
		//设置集合数据的来源，如果一个url,那么代表通过ajax发送请求获取数据
//		url:'todos.json',
		
//		设置存储器（采用h5 localStorage
		localStorage: new Backbone.LocalStorage('todos-backbone'),
		
		done: function() {
	    	return this.where({isCompleted: true});
		},
 
	    remaining: function() {
	      return this.where({isCompleted: false});
	    },
	});
	
//使用集合
	app.todos = new app.TodoCollection();
//	app.todos.create({"id": 1, "title": "~~~~~~~~~~~~~~~~~~~~~~~~~~"});
//	app.todos.fetch({reset: true});
//	app.todos.each(function(item, index) {
//		console.log(item.toJSON(), index);	
//	});
})();
