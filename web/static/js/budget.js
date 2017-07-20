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
        // selectedId: 0,
        isAdd: false,
        isAddTransaction: false,
        isDetail: false,

        form_message:'',

        form_id:0,
        form_month:'',
        form_year:'',
        form_category:'',
        form_currency:'',
        form_amount:'',
        form_note:'',

        month: ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "Desember"],
        year: [],
      },
      methods: {
        updateArray: function (result) {
          var obj_data = result.data;
          var data_index = this.data.findIndex(x => x.id == this.form_id)

          console.log(obj_data.category);
          this.data[data_index].note = obj_data.note; 
          this.data[data_index].month = obj_data.month;
          this.data[data_index].month_source = obj_data.month_source;
          this.data[data_index].year = obj_data.year; 
          this.data[data_index].amount = obj_data.amount; 
          this.data[data_index].category = obj_data.category; 
          this.data[data_index].category_label = obj_data.category_label; 
          this.data[data_index].currency = obj_data.currency;
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

        $.getJSON("http://localhost:4000/api/categories/"+user_id, (response) => { 
            vm.categories = response.data;
        });

        $.getJSON("http://localhost:4000/api/currencies/", (response) => { 
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
      // var form_id       =$('#form-id').val();
      // var form_note     =$('#form-note').val();
      // var form_month    =$('#form-month').val();
      // var form_year     =$('#form-year').val();
      // var form_amount   =$('#form-amount').val();
      // var form_category =$('#form-category').val();
      // var form_currency =$('#form-currency').val();

      var csrf = document.querySelector("meta[name=csrf]").content;

      var submit_url="http://localhost:4000/api/budgets";
      var submit_type='POST';
      if(vm.form_id!=0){
        submit_url="http://localhost:4000/api/budgets/"+vm.form_id;
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
          budget: {
            currency: vm.form_currency,
            month: vm.form_month,
            year: vm.form_year,
            category: vm.form_category,
            amount: vm.form_amount,
            note: vm.form_note,
            created_by: user_id,
            updated_by: user_id
          }
        },
        success: function(data) { 
            if(vm.form_id!=0)
              vm.updateArray(data);
            else
              refresh_data();
            // $('#form-id').val(0);
            // $('#form-note').val('');
            // $('#form-amount').val('');

            set_form_empty();
            vm.form_message="<div class='alert alert-success'>Success updated data</div>";
        }.bind(this),
        error: function(xhr, status, err) {
            // console.log(xhr.responseText)
            var message="<div class='alert alert-danger'>";

            var list_error=xhr.responseJSON.errors;
            for(var error in list_error){
                message+=error+": "+list_error[error]+"</br>";
            }
            message+= "</div>";

            vm.form_message=message;
        }.bind(this)
      });
      return false;
    });

    var toggle_title=$("#toggle-title");
    var o = $($.AdminLTE.options.controlSidebarOptions);
    var sidebar = $(o.selector);

    $('body').on("click",'.toggle-event', function (e) {
        e.preventDefault();
        if (o.slide) {
          sidebar.addClass('control-sidebar-open');
        } else {
          $('body').addClass('control-sidebar-open');
        }

        toggle_title.html('');
        set_form_empty();
        var dataid = $(this).data('id');
        
        if(dataid=='adddata'){

          vm.isAdd=true;
          vm.isAddTransaction=false;
          vm.isDetail=false;
          if($(this).attr('id')=='add'){
            toggle_title.append("Add Budget");

            // $('#form-id').val(0);
            // $('#form-note').val('');
            // $('#form-amount').val('');
            // vm.selectedId=0;
          }
          else{
            var row_id = $(this).attr('id').substr(6);
            var data = vm.data.find(x => x.id == row_id)
            // vm.selectedId=row_id;
            vm.form_id=row_id;
            toggle_title.append("Update Budget for '"+data.note+"'");
            // console.log($('#form-id'));

            // $('#form-id').val(data.id);
            // $('#form-note').val(data.note);
            // $('#form-month').val(data.month);
            // $('#form-year').val(data.year);
            // $('#form-amount').val(data.amount);
            // $('#form-category').val(data.category);
            // $('#form-currency').val(data.currency);
            vm.form_note=data.note;
            vm.form_month=data.month_source;
            vm.form_year=data.year;
            vm.form_amount=data.amount;
            vm.form_category=data.category;
            vm.form_currency=data.currency;
          }
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

    function set_form_empty(){
      vm.form_message='';
      vm.form_id=0;
      vm.form_month='';
      vm.form_year='';
      vm.form_category='';
      vm.form_currency='';
      vm.form_amount='';
      vm.form_note='';
    }
    
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
          // vm.selectedId=0;
          refresh_data();
          set_form_empty();
        }.bind(this),
        error: function(xhr, status, err) {
            console.log(xhr.responseText)
        }.bind(this)
      });
    }
  }
}