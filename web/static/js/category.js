import {Socket} from "phoenix"

export var Category = {
  run: function(){
    var user_token = document.querySelector("meta[name=channel_token]").content;
    var user_id = document.querySelector("meta[name=channel_id]").content;

    var vm = new Vue({  
      el: "#category_list",
      data: {
        data: [],
        selectedId: 0,
      },
      methods: {
        updateArray: function (name, note) {
          var data_index = this.data.findIndex(x => x.id == this.selectedId)
          this.data[data_index].name = name; 
          this.data[data_index].note =  note;
        }
      }
    });

    $(document).ready(function() {
      refresh_data();
    });
    
    function refresh_data(){
      $.getJSON("/api/categories/"+user_id, (response) => { 
          vm.data = response.data;
      });
    }

    //click button submit
    $('body').on('submit',"#data-form", function () {
      var form_id=$('#form-id').val();
      var form_name=$('#form-name').val();
      var form_note=$('#form-note').val();

      var csrf = document.querySelector("meta[name=csrf]").content;
      loader.css("display", "block");

      var submit_url="/api/categories";
      var submit_type='POST';
      if(form_id!=0){
        submit_url="/api/categories/"+form_id;
        submit_type='PUT';
      }

      $.ajax({
        url: submit_url,
        dataType: 'json',
        type: submit_type,
        headers: {
            "X-CSRF-TOKEN": csrf 
        },
        data: {
          category: {
            name: form_name,
            note: form_note,
            user_id: user_id,
            inserted_by: user_id,
            updated_by: user_id
          }
        },
        success: function(data) { 
            if(form_id!=0)
              vm.updateArray(form_name, form_note);
            else
              refresh_data();
            
            set_form_empty();

            loader.css("display", "none");
            flash_message.html('<div class="box box-widget"><p class="text-green" style="text-align:center !important;padding: 5px;"><b>Success updated data</b></p></div>');
        }.bind(this),
        error: function(xhr, status, err) {
            var message="<div class='alert alert-danger'>";

            var list_error=xhr.responseJSON.errors;
            for(var error in list_error){
                message+=error+": "+list_error[error]+"</br>";
            }
            message+= "</div>";

            loader.css("display", "none");
            $('#form-message').html(message);
        }.bind(this)
      });
      return false;
    });

    var toggle_title=$("#toggle-title");
    var o = $($.AdminLTE.options.controlSidebarOptions);
    var sidebar = $(o.selector);

    //when open sidebar form
    $('body').on("click",'.toggle-event', function (e) {
      e.preventDefault()
      flash_message.html("");

        if (o.slide) {
          sidebar.addClass('control-sidebar-open');
        } else {
          $('body').addClass('control-sidebar-open');
        }

        set_form_empty();
        toggle_title.html('');

        //set value if update, no when add new data
        if($(this).attr('id')=='add'){
          toggle_title.append("Add Category");
        }
        else{
          toggle_title.append("Update Category");
          var row_id = $(this).attr('id');
          var data = vm.data.find(x => x.id == row_id)
          vm.selectedId=row_id;

          $('#form-id').val(data.id);
          $('#form-name').val(data.name);
          $('#form-note').val(data.note);
        }
    });

    $('.toggle-hide').on("click", function () {
      if (o.slide) {
        sidebar.removeClass('control-sidebar-open');
      } else {
        $('body').removeClass('control-sidebar-open');
      }
    });

    $('body').on('click','.delete-data', function(e) {
        e.preventDefault();
        flash_message.html("");
        vm.selectedId = $(this).attr('data-id');
        $('#myModal').modal('show');
    });

    $('body').on('click','#btn-yes', function(e) {
        e.preventDefault();
        delete_data(e)
        $('#myModal').modal('hide');
    });

    function set_form_empty(){
      $('#form-message').html("");

      vm.selectedId=0;
      $('#form-id').val(0);
      $('#form-name').val('');
      $('#form-note').val('');
    }

    var flash_message=$("#flash-message");
    var loader=$(".loader");
    
    function delete_data(event){
      loader.css("display", "block");
      var submit_url="/api/categories/"+vm.selectedId;
      var submit_type='DELETE';
      $.ajax({
        url: submit_url,
        dataType: 'json',
        type: submit_type,
        headers: {
            "X-CSRF-TOKEN": document.querySelector("meta[name=csrf]").content
        },
        success: function(data) { 
          vm.selectedId=0;
          refresh_data();
          set_form_empty();

          loader.css("display", "none");
          flash_message.html('<div class="box box-widget"><p class="text-green" style="text-align:center !important;padding: 5px;"><b>Success deleted data</b></p></div>');
        }.bind(this),
        error: function(xhr, status, err) {
          loader.css("display", "none");
          flash_message.html('<div class="box box-widget"><p class="text-red" style="text-align:center !important;padding: 5px;"><b>Failed deleted data</b></p></div>');
            console.log(xhr.responseText)
        }.bind(this)
      });
    }

  }
}