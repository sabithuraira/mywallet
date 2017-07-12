import {Socket} from "phoenix"

export var Budget = {
  run: function(){
    var user_token = document.querySelector("meta[name=channel_token]").content;
    var user_id = document.querySelector("meta[name=channel_id]").content;

    var vm = new Vue({  
      el: "#budget_list",
      data: {
        data: [],
        categories: [],
        currencies: [],
        selectedId: 0,
      },
      methods: {
        updateArray: function (name, note) {
          var data_index = this.data.findIndex(x => x.id == this.selectedId)
          this.data[data_index].name = name; 
          this.data[data_index].note =  note;
        },
        // toogleEvent: function(dataid){
        //   if(dataid=='adddata'){
        //     tab_pane.append(add_data);
        //     toggle_title.append("Add Budget");
        //   }
        //   else if(dataid=='addtransaction'){
        //     tab_pane.append(add_transaction);
        //     toggle_title.append("Add Transaction");
        //   }
        //   else{ 
        //     tab_pane.append(detail);
        //     toggle_title.append("Detail");
        //   }

        //   this.$compile(tab_pane.get(0));
        //   this.$compile(toggle_title.get(0));
        // },
      }
    });
    

    let container = document.getElementById("budget_list")
    let socket = new Socket("/socket", {
      params: { token: user_token }
    })
    socket.connect()

    let channel = socket.channel("account:2")
    // channel.on("update", data => {
    //   refresh_data();
    // })

    //account channel join
    channel.join()
      .receive("ok", resp => { 
        refresh_data(); 

        $.getJSON("http://localhost:4000/api/categories/"+user_id, (response) => { 
            vm.categories = response.data;
        });

        $.getJSON("http://localhost:4000/api/currencies/", (response) => { 
            vm.currencies = response.data;
        });
        
      })
      .receive("error", reason => console.log("failed to join ha", reason))


    function refresh_data(){
      $.getJSON("http://localhost:4000/api/accounts/"+user_id, (response) => { 
          vm.data = response.data;
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

    var tab_pane = $("#right-sidebar");
    var toggle_title=$("#toggle-title");
    var o = $($.AdminLTE.options.controlSidebarOptions);
    var sidebar = $(o.selector);

    $('#data-date, #recurring-date').datepicker()
    

    $('.toggle-event').on("click", function () {
        if (o.slide) {
          sidebar.addClass('control-sidebar-open');
        } else {
          $('body').addClass('control-sidebar-open');
        }

        tab_pane.html('');
        toggle_title.html('');
        var dataid = $(this).data('id');
        // vm.toogleEvent(dataid);


        var res;//= Vue.compile(resultHTML)

        if(dataid=='adddata'){
          tab_pane.append(add_data);
          toggle_title.append("Add Budget");

          res = Vue.compile(add_data);
        }
        else if(dataid=='addtransaction'){
          tab_pane.append(add_transaction);
          toggle_title.append("Add Transaction");

          res = Vue.compile(add_transaction);
        }
        else{ 
          tab_pane.append(detail);
          toggle_title.append("Detail");

          res = Vue.compile(detail);
        }

        var vm = new Vue({
          render: res.render,
          staticRenderFns: res.staticRenderFns
        })
        vm.$mount('#budget_list')
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
      var submit_url="http://localhost:4000/api/accounts/"+vm.selectedId;
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


    var add_data = $("<div />");
    var month=["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "Desember"];

    var str_month="";
    for(var i=1;i<=month.length;++i){
      str_month+="<option value="+i+">"+month[i-1]+"</option>";
    }

    var str_year="";
    for(var i=115;i<=new Date().getYear();++i){
      str_year+="<option>"+(i+1900)+"</option>";
    }

    add_data.append(
        "<form role='form'>"
          + "<div>"

            + "<div class='form-group'>"
              + "<input type='hidden' id='form-id'>"
              + "<select id='form-month' class='form-control  input-sm select2'>"
                + str_month
              + "</select>"
            + "</div>"

            + "<div class='form-group'>"
              + "<select id='form-year' class='form-control  input-sm select2'>"
                + str_year
              + "</select>"
            + "</div>"

            + "<div class='form-group'>"
              + "<p>Category</p>"
              + "<list-two-params data="+ vm.categories +" list-id='form-category'></list-two-params>"
            + "</div>"

            + "<div class='form-group'>"
              + "<p>Currency</p>"
              + "<input type='text' class='form-control input-sm' placeholder='Enter budget'>"
            + "</div>"

            + "<div class='form-group'>"
              + "<p>Budget</p>"
              + "<input type='text' class='form-control input-sm' placeholder='Enter budget'>"
            + "</div>"
          + "</div>"

          + "<div class='box-footer'>"
            + "<button type='submit' class='btn btn-primary'>Submit</button>"
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

  }
}