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
    
    let container = document.getElementById("category_list")
    let socket = new Socket("/socket", {
      params: { token: user_token }
    })
    socket.connect()

    let channel = socket.channel("account:2")
    //account channel join
    channel.join()
      .receive("ok", resp => { refresh_data(); })
      .receive("error", reason => console.log("failed to join ha", reason))


    function refresh_data(){
      $.getJSON("http://localhost:4000/api/categories/"+user_id, (response) => { 
          vm.data = response.data;
      });
    }

    //click button submit
    $('body').on('submit',"#data-form", function () {
      var form_id=$('#form-id').val();
      var form_name=$('#form-name').val();
      var form_note=$('#form-note').val();

      var csrf = document.querySelector("meta[name=csrf]").content;

      var submit_url="http://localhost:4000/api/categories";
      var submit_type='POST';
      if(form_id!=0){
        submit_url="http://localhost:4000/api/categories/"+form_id;
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

            $('#form-id').val(0);
            $('#form-name').val('');
            $('#form-note').val('');
        }.bind(this),
        error: function(xhr, status, err) {
            console.log(xhr.responseText)
        }.bind(this)
      });
      return false;
    });

    //for right tab pane
    var tab_pane = $("#right-sidebar");
    var toggle_title=$("#toggle-title");

    var o = $($.AdminLTE.options.controlSidebarOptions);
    var sidebar = $(o.selector);

    $('#data-date, #recurring-date').datepicker()
    
    var add_data = $("<div />");
    add_data.append(
      "<form role='form' id='data-form'>"
          + "<div>"
            + "<div class='form-group'>"
              + "<p>Name</p>"
              + "<input type='hidden' id='form-id'>"
              + "<input type='text' id='form-name' class='form-control input-sm' placeholder='Enter name'>"
            + "</div>"

            + "<div class='form-group'>"
              + "<p>Note</p>"
              + "<input type='text' id='form-note' class='form-control input-sm' placeholder='Enter note'>"
            + "</div>"

          + "</div>"

          + "<div class='box-footer'>"
            + "<button type='submit' id='btn-submit' class='btn btn-primary'>Submit</button>"
          + "</div>"
        + "</form>"
    );

    //when open sidebar form
    $('body').on("click",'.toggle-event', function () {
        console.log('enter toggle')
        if (o.slide) {
          sidebar.addClass('control-sidebar-open');
        } else {
          $('body').addClass('control-sidebar-open');
        }

        tab_pane.html('');
        toggle_title.html('');
        var dataid = $(this).data('id');
        if(dataid=='adddata'){
          tab_pane.append(add_data);
          tab_pane.clone();
          toggle_title.append("Add Account");
        }

        //set value if update, no when add new data
        if($(this).attr('id')=='add'){
          $('#form-id').val(0);
          $('#form-name').val('');
          $('#form-note').val('');
          vm.selectedId=0;
        }
        else{
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
        vm.selectedId = $(this).attr('data-id');
        $('#myModal').modal('show');
    });

    $('body').on('click','#btn-yes', function(e) {
        e.preventDefault();
        delete_data(e)
        $('#myModal').modal('hide');
    });

    
    function delete_data(event){
      var submit_url="http://localhost:4000/api/categories/"+vm.selectedId;
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
        }.bind(this),
        error: function(xhr, status, err) {
            console.log(xhr.responseText)
        }.bind(this)
      });
    }

  }
}