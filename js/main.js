//定义一个全局的app对象，存储backbone中定义的组件（model,views..)。
window.app = {};
//页面加载完毕，清除加载层
$(function($){
	setTimeout(function(){
		$('#load').fadeOut();
	}, 600);
});