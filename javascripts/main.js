"use strict";

let apiKeys = {};

function putTodoInDom(){
	FbAPI.getTodos(apiKeys).then(function(items){
		console.log("items from FB", items);
		$('#completed-task').html("");
		$('#incomplete-task').html("");
		items.forEach(function(item){
        if(item.isCompleted === true){
          let newListItem = '<li>';
          newListItem+='<div class="col-xs-8">';
          newListItem+='<input class="checkboxStyle" type="checkbox" checked>';
          newListItem+=`<label class="inputLabel">${item.task}</label>`;
          newListItem+='<input type="text" class="inputTask">';
          newListItem+='</div>';
          newListItem+='<div class="col-xs-4">';
          newListItem+='<button class="btn btn-default col-xs-6 edit">Edit</button>';
          newListItem+='<button class="btn btn-danger col-xs-6 delete">Delete</button> ';
          newListItem+='</div>';
          newListItem+='</li>';
          //apend to list
          $('#completed-task').append(newListItem);
        } else {
          let newListItem = '<li>';
          newListItem+='<div class="col-xs-8">';
          newListItem+='<input class="checkboxStyle" type="checkbox">';
          newListItem+=`<label class="inputLabel">${item.task}</label>`;
          newListItem+='<input type="text" class="inputTask">';
          newListItem+='</div>';
          newListItem+='<div class="col-xs-4">';
          newListItem+='<button class="btn btn-default col-xs-6 edit">Edit</button>';
          newListItem+=`<button class="btn btn-danger col-xs-6 delete" data-fbid="${item.id}">Delete</button>`;
          newListItem+='</div>';
          newListItem+='</li>';
          //apend to list
          $('#incomplete-task').append(newListItem);
        }	
		});
	});
}


$(document).ready(function(){
//console.log("ready");
FbAPI.firebaseCredentials().then(function(keys){
	//console.log("keys", keys);
		apiKeys = keys;
		firebase.initializeApp(apiKeys);
		putTodoInDom();
	});

	$('#button').on('click',function(){
		console.log("click");
		let newItem = {
			"task": $('#input').val(),
			"isCompleted": false
		};
		FbAPI.addTodo(apiKeys, newItem).then(function(){
			putTodoInDom();
		});
	});

	$('ol').on('click','.delete', function(){
		let itemId = $(this).data('fbid');
		FbAPI.deleteTodo(apiKeys, itemId).then(function(){
			putTodoInDom();
		});
	});

	$('#incomplete-task').sortable(); 

    $('#completed-task').sortable();
});





















// $(document).ready(
//     function(){
//         $('#button').click(
//             function(){
//                 var toinprogress = $('input[name=ListItem]').val();
//                  $('#todoList').append(`<li id="taskText "class="task_container task">${toinprogress}<button class="completeButton button" id="completeButton">Complete</button><button class="editButton button" id="editButton">Edit</button></li>`);
//             });
       
//        $("input[name=ListItem]").keyup(function(event){
//           if(event.keyCode == 13){
//             $("#button").click();
//           }         
//       });

//        $(document).on('dblclick','li', function(){
//         	$(this).toggleClass('strike').fadeOut('slow');    
//       	});
      
//       $(document).on('click','.completeButton', function(){
//         $('taskText').toggleClass('strike').fadeOut('slow'); 
//         $(this).closest('li').appendTo('#completedlist');   
//       });
 
//       $('input').focus(function() {
//         $(this).val('');
//       });

//       $(document).on('click', '.editButton', function(){
//     		let input = $('input[name=ListItem]').val();
//     		$(this).closest('li').prop("contenteditable", true).focus();
//     		console.log(this.closest('li'));
//     		return false;
// 		});
       
//        $('#todoList').sortable(); 

//        $('#completedlist').sortable();

      
    		
//     	//$( "#todoList" ).disableSelection();
      
//     }
// );
