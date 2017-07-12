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
        isAdd: false,
        isAddTransaction: false,
        isDetail: false,
        month: ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "Desember"],
        year: [],
      },
      methods: {
        updateArray: function (name, note) {
          var data_index = this.data.findIndex(x => x.id == this.selectedId)
          this.data[data_index].name = name; 
          this.data[data_index].note =  note;
        },
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

        $.getJSON("http://localhost:4000/api/budgets/"+user_id, (response) => { 
            vm.categories = response.data;
        });

        $.getJSON("http://localhost:4000/api/budgets/", (response) => { 
            vm.currencies = response.data;
        });

        for(var i=115;i<=new Date().getYear();++i){
          vm.year.push(i+1900);
        }
        
      })
      .receive("error", reason => console.log("failed to join ha", reason))


    function refresh_data(){
      $.getJSON("http://localhost:4000/api/budgets/"+user_id, (response) => { 
          vm.data = response.data;
      });
    }

    //click button submit
    $('body').on('submit',"#data-form", function () {
      var form_id       =$('#form-id').val();
      var form_note     =$('#form-note').val();
      var form_month    =$('#form-month').val();
      var form_year     =$('#form-year').val();
      var form_amount   =$('#form-amount').val();
      var form_category =$('#form-category').val();
      var form_currency =$('#form-currency').val();

      var csrf = document.querySelector("meta[name=csrf]").content;

      var submit_url="http://localhost:4000/api/budgets";
      var submit_type='POST';
      if(form_id!=0){
        submit_url="http://localhost:4000/api/budgets/"+form_id;
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
            created_by: user_id,
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

        toggle_title.html('');
        var dataid = $(this).data('id');

        if(dataid=='adddata'){
          toggle_title.append("Add Budget");

          vm.isAdd=true;
          vm.isAddTransaction=false;
          vm.isDetail=false;
        }
        else if(dataid=='addtransaction'){
          toggle_title.append("Add Transaction");

          vm.isAdd=false;
          vm.isAddTransaction=true;
          vm.isDetail=false;
        }
        else{ 
          toggle_title.append("Detail");

          vm.isAdd=false;
          vm.isAddTransaction=false;
          vm.isDetail=true;
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

  }
}