"use strict";

$(document).ready(
    function(){
        $('#button').click(
            function(){
                var toinprogress = $('input[name=ListItem]').val();
                 $('#todoList').append(`<li id="taskText "class="task_container task">${toinprogress}<button class="completeButton button" id="completeButton">Complete</button><button class="editButton button" id="editButton">Edit</button></li>`);
            });
       
       $("input[name=ListItem]").keyup(function(event){
          if(event.keyCode == 13){
            $("#button").click();
          }         
      });

       $(document).on('dblclick','li', function(){
        	$(this).toggleClass('strike').fadeOut('slow');    
      	});
      
      $(document).on('click','.completeButton', function(){
        $('taskText').toggleClass('strike').fadeOut('slow'); 
        $(this).closest('li').appendTo('#completedlist');   
      });
 
      $('input').focus(function() {
        $(this).val('');
      });

      $(document).on('click', '.editButton', function(){
    		let input = $('input[name=ListItem]').val();
    		$(this).closest('li').prop("contenteditable", true).focus();
    		console.log(this.closest('li'));
    		return false;
		});
       
       $('#todoList').sortable(); 

       $('#completedlist').sortable();

      
    		
    		//$( "#todoList" ).disableSelection();
      
    }
);
