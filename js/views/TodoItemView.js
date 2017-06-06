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
