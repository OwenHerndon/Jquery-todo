"use strict";

let apiKeys = {};
let uid = "";

function putTodoInDom(){
	FbAPI.getTodos(apiKeys, uid).then(function(items){
		console.log("items from FB", items);
		$('#completed-task').html("");
		$('#incomplete-task').html("");
		items.forEach(function(item){
        if(item.isCompleted === true){
          let newListItem = `<li data-completed=${item.isCompleted}>`;
          newListItem+=`<div class="col-xs-8" data-fbid="${item.id}">`;
          newListItem+='<input class="checkboxStyle" type="checkbox" checked>';
          newListItem+=`<label class="inputLabel">${item.task}</label>`;
          newListItem+='<input type="text" class="inputTask">';
          newListItem+='</div>';
          newListItem+='<div class="col-xs-4">';
          newListItem+=`<button class="btn btn-default col-xs-6 edit" data-fbid="${item.id}">Edit</button>`;
          newListItem+=`<button class="btn btn-danger col-xs-6 delete">Delete</button> `;
          newListItem+='</div>';
          newListItem+='</li>';
          //apend to list
          $('#completed-task').append(newListItem);
        } else {
          let newListItem = `<li data-completed=${item.isCompleted}>`;
          newListItem+=`<div class="col-xs-8" data-fbid="${item.id}">`;
          newListItem+='<input class="checkboxStyle" type="checkbox">';
          newListItem+=`<label class="inputLabel">${item.task}</label>`;
          newListItem+='<input type="text" class="inputTask">';
          newListItem+='</div>';
          newListItem+='<div class="col-xs-4">';
          newListItem+=`<button class="btn btn-default col-xs-6 edit" data-fbid="${item.id}">Edit</button>`;
          newListItem+=`<button class="btn btn-danger col-xs-6 delete" data-fbid="${item.id}">Delete</button>`;
          newListItem+='</div>';
          newListItem+='</li>';
          //apend to list
          $('#incomplete-task').append(newListItem);
        }	
		});
	});
}

function createLoginButton(){
		FbAPI.getUser(apiKeys,uid).then(function(userResponse){
			console.log("hey!", userResponse);
			$('#logout-container').html('');
			let currentUsername = userResponse.username;
			let logoutButton = `<button class="btn btn-danger" id="logoutButton">LOGOUT ${currentUsername}</button>`;
			$('#logout-container').append(logoutButton);
		});
	}


$(document).ready(function(){
//console.log("ready");
FbAPI.firebaseCredentials().then(function(keys){
	//console.log("keys", keys);
		apiKeys = keys;
		firebase.initializeApp(apiKeys);
	});

	
	//add task button
	$('#button').on('click',function(){
		console.log("click");
		let newItem = {
			"task": $('#input').val(),
			"isCompleted": false,
			"uid":uid
		};
		FbAPI.addTodo(apiKeys, newItem).then(function(){
			putTodoInDom();
		});
	});


	//delete button
	$('ol').on('click','.delete', function(){
		let itemId = $(this).data('fbid');
		FbAPI.deleteTodo(apiKeys, itemId).then(function(){
			putTodoInDom();
		});
	});

	//edit button
	$('ol').on('click','.edit', function(){
		let parent = $(this).closest('li');
		if(!parent.hasClass("editMode")){
			parent.addClass("editMode");
		} else{
			let itemId = $(this).data('fbid');
			let editedItem ={
				"task": parent.find(".inputTask").val(),
				"isCompleted":false,
				"uid":uid
			};
	
		
		 	FbAPI.editTodo(apiKeys, itemId, editedItem).then(function(){
				parent.removeClass("editMode");
				putTodoInDom();
		 	});
		}
	});

	//checkbox
	$('ol').on('change', 'input[type="checkbox"]', function(){
			let updatedIsCompleted = $(this).closest('li').data('completed');
			let itemId = $(this).parent().data('fbid');
			let task = $(this).siblings('.inputLabel').html();

			let editedItem = {
				"task": task,
				"isCompleted": !updatedIsCompleted,
				"uid":uid
			};
			FbAPI.editTodo(apiKeys, itemId, editedItem).then(function(){
				putTodoInDom();
		 	});
	});

	//register
	$('#registerButton').on('click', function(){
		let email = $('#inputEmail').val();
		let password = $('#inputPassword').val();
		let username = $('#inputUsername').val();
		let user = {
			"email": email,
			"password": password
		};
		FbAPI.registerUser(user).then(function(registerResponse){
			console.log("reg response",registerResponse);
			let newUser = {
				"username":username,
				"uid":registerResponse.uid
			};
			return FbAPI.addUser(apiKeys,newUser);
			//return FbAPI.loginUser(user);
		}).then(function(userResponse){
			return FbAPI.loginUser(user);
		}).then(function(loginResponse){
			console.log("loginResponse", loginResponse);
			uid = loginResponse.uid;
			createLoginButton();
			putTodoInDom();
			$('#login-container').addClass('hide');
			$('#todo-container').removeClass('hide');
		});
	});


	//login
	$('#loginButton').on('click' , function(){
		let email = $('#inputEmail').val();
		let password = $('#inputPassword').val();

		let user = {
			"email": email,
			"password": password
		};
		FbAPI.loginUser(user).then(function(loginResponse){
			console.log("loginResponse", loginResponse);
			uid = loginResponse.uid;
			createLoginButton();
			putTodoInDom();
			$('#login-container').addClass('hide');
			$('#todo-container').removeClass('hide');
		});
	});

	//logout button
	$('#logout-container').on('click', "#logoutButton" , function(){
		FbAPI.logoutUser();
		uid = "";
		$('#incomplete-task').html("");
		$('#completed-task').html("");
		$('#inputEmail').val("");
		$('#inputPassword').val("");
		$('#inputUsername').val("");
		$('#login-container').removeClass('hide');
		$('#todo-container').addClass('hide');
		});
	

	//jquery ui
	$('#incomplete-task').sortable(); 
	$('#completed-task').sortable();
    $( '#draggable' ).draggable();
    $( '#draggable2' ).draggable();

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
