//定义一个全局的app对象，存储backbone中定义的组件（model,views..)。
window.app = {};
//页面加载完毕，清除加载层
$(function($){
	setTimeout(function(){
		$('#load').fadeOut();
	}, 600);
});
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

(function(){
	//创建一个备忘录列表项的视图组件
	app.TodoItemView = Backbone.View.extend({
		tagName: "li",

		className: "todo-item",
		
		events: {
		   "click .destroy": "destroyModel",
		   "click input.toggle": "toggleTodo",
		   "dblclick .view label": "editing",
		   "keypress .edit": "endEdit",
		   "blur .edit": "updateTitleTodo", 	
		},
		destroyModel: function() {
			this.model.destroy();
		},
		removeView: function(){
			this.$el.slideUp('fast', function (){
				this.$el.remove();
			}.bind(this));
		},
		toggleTodo: function (){
			this.model.toggle();
		},
		updateTitleTodo: function (){
			var val = this.$('.edit').val().trim();
			if(val) {
				this.model.save({title: val});
			}
			this.$el.removeClass('editing');
		},
		editing: function (){
			this.$el.addClass('editing');
			this.$('.edit').focus();
		},
		endEdit: function (){
			if ((event.which && event.which == 13) || (event.keyCode && event.keyCode == 13)) {
				this.updateTitleTodo();
			}
		},
		toggleView: function (){
			var v = this.model.get('isCompleted');
			this.$('.toggle').prop('checked', v);
			this.$el.toggleClass('completed', v);
		},
		updateTitleView: function (){
			var val = this.model.get('title');
			this.$('label').html(val);
		},
		hideView: function(){
			this.isHidden()?
				this.$el.slideUp('fast') : this.$el.slideDown('fast');				
		},
		isHidden:function(){
			 return this.model.get("isCompleted") ? app.todoFilter == "active" : app.todoFilter == "completed"
		},
		initialize: function() {
			//先删模型， 模型删除后， 触发destroy事件， 再删除视图。
			//保证了模型一定被删除，才改动视图
			this.listenTo(this.model, 'destroy', this.removeView);
			this.listenTo(this.model, 'change:isCompleted', this.toggleView);
			this.listenTo(this.model, 'change:title', this.updateTitleView);
			this.listenTo(this.model, 'hide', this.hideView);
		},
		
		template: _.template($('#item_template').html()),
		render: function() {
//			this.model由外部传入（创建视图对象时）
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.toggleClass('completed', this.model.get('isCompleted'));
			return this;
		}
	});
	
	//TodoItem视图的使用
//	var m = new app.TodoModel({title:"eat rise"});
//	var v = new app.TodoItemView({model: m});
//	v.render().$el.appendTo("ul.todo-list");
})();

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
