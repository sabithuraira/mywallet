import {Socket} from "phoenix"

export var Account = {
  run: function(){

    new Vue({  
      el: "#hello-world",
      data: {
        message: "Hello World"
      }
    });

    var list_data=[]
    let container = document.getElementById("account_list")
    let socket = new Socket("/socket")
    socket.connect()

    let accountChannel = socket.channel("account:2")
    accountChannel.on("update", data => {
      console.log('enter udpate data');
      refresh_data();
    })

    //account channel join
    accountChannel.join()
      .receive("ok", resp => {
        refresh_data();
      })
      .receive("error", reason => console.log("failed to join ha", reason))


    function refresh_data(){
      $.getJSON("http://localhost:4000/api/accounts", (response) => { 
          list_data=response.data;
          container.innerHTML='';
          var rowElement = '';
          list_data.forEach(function(row) {

            rowElement +='<tr data-toggle="collapse" data-target="'+row.id+'" class="accordion-toggle">'
              + '<td><input type="checkbox" /></td>'
              + '<td>'+row.name+'</td>'
              + '<td>'+(row.note==null ? "" : row.note)+'</td>'
              + '<td><a id="'+row.id+'" class="btn btn-default btn-sm toggle-event" href="#" data-id="adddata"><i class="fa fa-plus-square-o"></i> Update</a>'
              + '<a class="btn btn-default btn-sm toggle-event" href="#" data-id="addtransaction"><i class="fa fa-plus-square-o"></i> Add Paying</a>'
              + '<a class="btn btn-default btn-sm toggle-event" href="#" data-id="detail"><i class="fa fa-search"></i> Detail</a></td>';
          });
          container.innerHTML = (rowElement)
      });
    }

    //click button submit
    $('body').on('submit',"#data-form", function () {
      var form_id=$('#form-id').val();
      var form_name=$('#form-name').val();
      var form_note=$('#form-note').val();

      var csrf = document.querySelector("meta[name=csrf]").content;

      var submit_url="http://localhost:4000/api/accounts";
      var submit_type='POST';
      if(form_id!=0){
        submit_url="http://localhost:4000/api/accounts/"+form_id;
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
          account: {
            name: form_name,
            note: form_note,
            created_by: 2,
            updated_by: 2
          }
        },
        success: function(data) {
            console.log('success');
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

    var add_transaction = $("<div />");

    add_transaction.append(
        "<form role='form'>"
          + "<div>"
            + "<div class='form-group'>"
              + "<p>Currency</p>"
              + "<select class='form-control  input-sm select2' style='width: 100%;'>"
                + "<option selected='selected'>USD</option>"
                + "<option>EUR</option>"
                + "<option>JPY</option>"
                + "<option>SGD</option>"
                + "<option>IDR</option>"
                + "<option>AUD</option>"
              + "</select>"
            + "</div>"

            + "<div class='form-group'>"
              + "<p>Amount</p>"
              + "<input type='text' class='form-control input-sm' id='exampleInputPassword1' placeholder='Enter budget'>"
            + "</div>"

            + "<div class='form-group'>"
              + "<p>Date</p>"
              + "<div class='input-group'>"
                + "<div class='input-group-addon'>"
                  + "<i class='fa fa-calendar'></i>"
                + "</div>"
                + "<input type='text' class='form-control input-sm pull-right' id='data-date'>"
              + "</div>"
            + "</div>"

            + "<div class='form-group'>"
              + "<p>Account</p>"

              + "<select class='form-control input-sm select2' style='width: 100%;'>"
                + "<option selected='selected'>Account A</option>"
                + "<option>Account B</option>"
              + "</select>"
            + "</div>"

            + "<div class='form-group'>"
              + "<p>Note</p>"
              + "<input type='text' class='form-control input-sm' placeholder='Enter note'>"
            + "</div>"


            + "<div class='form-group'>"
              + "<label class='control-sidebar-subheading'>"
                + "Recurring"
                + "<input type='checkbox' class='pull-right' checked>"
              + "</label>"
            + "</div>"

            + "<div class='form-group'>"
              + "<p>Cycle</p>"
              + "<select class='form-control  input-sm select2' style='width: 100%;'>"
                + "<option selected='selected'>Daily</option>"
                + "<option>Weekly</option>"
                + "<option>Every 2 Weeks</option>"
                + "<option>Monthly</option>"
                + "<option>Every 2 Months</option>"
                + "<option>Every 3 Months</option>"
                + "<option>Every 6 Months</option>"
                + "<option>Yearly</option>"
              + "</select>"
            + "</div>"

            + "<div class='form-group'>"
              + "<p>End Date</p>"
              + "<div class='input-group'>"
                + "<div class='input-group-addon'>"
                  + "<i class='fa fa-calendar'></i>"
                + "</div>"
                + "<input type='text' class='form-control input-sm pull-right' id='recurring-date'>"
              + "</div>"
            + "</div>"
          + "</div>"

          + "<div class='box-footer'>"
            + "<button type='submit' class='btn btn-primary'>Submit</button>"
          + "</div>"
        + "</form>"
    );

    var detail = $("<div />");

    detail.append(
        "<ul class='products-list product-list-in-box'>"
          + "<li class='item'>"
            + "<div>"
              + "<a href='#' class='product-title'>Buy Some Food"
                + "<span class='label label-warning pull-right'>$ 10.00</span>"
              + "</a>"
              + "<span class='product-description'>"
                + "12-25-2017"
                + "<span class='label label-info pull-right'>Account A</span>"
              + "</span>"
            + "</div>"
          + "</li>"
          
          + "<li class='item'>"
            + "<div>"
              + "<a href='#' class='product-title'>Buy Some Food"
                + "<span class='label label-warning pull-right'>$ 10.00</span>"
              + "</a>"
              + "<span class='product-description'>"
                + "12-25-2017"
                + "<span class='label label-info pull-right'>Account A</span>"
              + "</span>"
            + "</div>"
          + "</li>"
          
          + "<li class='item'>"
            + "<div>"
              + "<a href='#' class='product-title'>Buy Some Food"
                + "<span class='label label-warning pull-right'>$ 10.00</span>"
              + "</a>"
              + "<span class='product-description'>"
                + "12-25-2017"
                + "<span class='label label-info pull-right'>Account A</span>"
              + "</span>"
            + "</div>"
          + "</li>"
          
          + "<li class='item'>"
            + "<div>"
              + "<a href='#' class='product-title'>Buy Some Food"
                + "<span class='label label-warning pull-right'>$ 10.00</span>"
              + "</a>"
              + "<span class='product-description'>"
                + "12-25-2017"
                + "<span class='label label-info pull-right'>Account A</span>"
              + "</span>"
            + "</div>"
          + "</li>"
          
          + "<li class='item'>"
            + "<div>"
              + "<a href='#' class='product-title'>Buy Some Food"
                + "<span class='label label-warning pull-right'>$ 10.00</span>"
              + "</a>"
              + "<span class='product-description'>"
                + "12-25-2017"
                + "<span class='label label-info pull-right'>Account A</span>"
              + "</span>"
            + "</div>"
          + "</li>"
          
        + "</ul>"
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
        else if(dataid=='addtransaction'){
          tab_pane.append(add_transaction);
          toggle_title.append("Add Paying");
        }
        else{ 
          tab_pane.append(detail);
          toggle_title.append("Detail");
        }

        //set value if update, no when add new data
        if($(this).attr('id')=='add'){
          $('#form-id').val(0);
        }
        else{
          var row_id = $(this).attr('id');
          var data = list_data.find(x => x.id == row_id)

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
  }
}