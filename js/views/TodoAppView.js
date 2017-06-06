(function(){
	
	//视图其实就是一组（一个）html标签
	//定义应用的主视图类
	//一个视图组件:
	//	内容定义有两种方式：
	//			1、el属性直接与页面中已有的标签关联。
	//			2、tagName,className,id...定义一个标签在内存中。（不会添加到页面中。）
	app.TodoAppView = Backbone.View.extend({
		el: ".todoapp",
		statsTemplate: _.template($('#stats_template').html()),
		events: {
			//按下回车新建一个模型，然后添加到集合中
			"keypress input.new-todo": "newTodo",
			"click .clear-completed": "clearCompleted",
			"click .toggle-all": "toggleAll",
		},
		toggleAll: function(){
			app.todos.each(function(item) {
				item.toggle();
			});
		},
		clearCompleted: function(){
			_.invoke(app.todos.done(), "destroy");
		},
		newTodo: function (event){
			var val = this.$input.val().trim();
			if (((event.which && event.which == 13) || (event.keyCode && event.keyCode == 13)) && val) {
				var m = new app.TodoModel({title: val});
				app.todos.create(m);
				app.todos.trigger('addOne', m);
				this.$input.val('');
			}
		},
		loadTodos: function () {
			app.todos.each(this.loadTodo, this);
		},
		loadTodo: function (todo) {
			var itemview = new app.TodoItemView({model: todo});
			var $t = itemview.render().$el;
			$t.hide();
			$t.appendTo(this.$todoList);
			$t.slideDown();
		},
	
//		all: function(event){
//			console.log(event);
//		},
		render: function(){
			var done = app.todos.done().length;
			var remaining = app.todos.remaining().length;
			if (app.todos.length) {
        		this.$main.show();
			    this.$footer.slideDown();
			    this.$footer.html(this.statsTemplate({done: done, remaining: remaining}));
			    this.$footer.find('a').removeClass('selected')
			    .filter("[href='#"+app.todoFilter+"']").addClass("selected");
			} else {
			    this.$main.slideUp('fast');
			    this.$footer.slideUp();
			}
		},
		filterOne: function(todo){
			todo.trigger('hide');
		},
		filterAll: function(){
			app.todos.each(this.filterOne);
		},
		initialize: function (){
			this.$todoList = this.$('.todo-list');
			this.$input = this.$('input');
			this.$footer = this.$('.footer');
			this.$main = this.$('.main');
			
			//页面第一次加载时，把数据模型创建成模型，ITEM视图，然后添加到APP视图中
			this.listenTo(app.todos, 'reset', this.loadTodos);
			//新加TODO时,把数据模型创建成模型，ITEM视图，然后添加到APP视图中
			this.listenTo(app.todos, 'addOne', this.loadTodo);
			this.listenTo(app.todos, 'filter', this.filterAll);
			this.listenTo(app.todos, 'all', this.render);
			
			app.todos.fetch({reset: true});
		},
	});
	
	//创建视图对象，只有创建视图对象的时候，才会和页面中元素关联。
	new app.TodoAppView();
})();
