import {Socket} from "phoenix"

export var Budget = {
  run: function(){
    var user_token = document.querySelector("meta[name=channel_token]").content;
    var user_id = document.querySelector("meta[name=channel_id]").content;

    // var monthNames = ["January", "February", "March", "April", "May", "June",
    //   "July", "August", "September", "October", "November", "December"
    // ];

    var vm = new Vue({  
      el: "#budget_list",
      data: {
        current_month: (new Date().getMonth()) + 1,
        current_year: (new Date().getYear()) + 1900,
        resume:{
            total_budget:"",
            total_pay:""
        },
        data: [],
        categories: [],
        currencies: [],
        accounts:[],
        transactions:[],
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

        trans_date:'',
        trans_amount:'',
        trans_currency: '',
        trans_account:'',
        trans_note:'',        
        month: ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "Desember"],
        year: [],
      },
      methods: {
        updateArray: function (result) {
          var obj_data = result.data;
          var data_index = this.data.findIndex(x => x.id == this.form_id)

          this.data[data_index].note = obj_data.note; 
          this.data[data_index].month = obj_data.month;
          this.data[data_index].month_source = obj_data.month_source;
          this.data[data_index].year = obj_data.year; 
          this.data[data_index].amount = obj_data.amount; 
          this.data[data_index].category = obj_data.category; 
          this.data[data_index].category_label = obj_data.category_label; 
          this.data[data_index].currency = obj_data.currency;

          // when you update a budget data, it should be set
          // new information about expense and diff value
          // but it not ready for now
          // FIX IT LATER!!
          
          // this.data[data_index].detail_total = obj_data.detail_total;
          // this.data[data_index].detail_diff = obj_data.detail_diff;
        },
      },
      computed: {
        currentLabelMonth: function () {
          return this.month[this.current_month]
        }
      }
    });
    

    let container = document.getElementById("budget_list")

      $(document).ready(function() {
        refresh_data(); 

        $.getJSON("/api/categories/"+user_id, (response) => { 
            vm.categories = response.data;
        });

        $.getJSON("/api/currencies/", (response) => { 
            vm.currencies = response.data;
        });

        $.getJSON("/api/accounts/"+user_id, (response) => { 
            vm.accounts = response.data;
        });

        for(var i=115;i<=new Date().getYear();++i){
          vm.year.push(i+1900);
        }
      });

    function refresh_data(){
      $.getJSON("/api/budgets/"+user_id, (response) => { 
          vm.data = response.data;
      });

      $.getJSON("/api/budgets/resume/"+user_id+"/"+vm.current_month+"/"+vm.current_year, (response) => {
          vm.resume = response;
      });
    }

    //click button submit
    $('body').on('submit',"#data-form", function () {
      var csrf = document.querySelector("meta[name=csrf]").content;
      loader.css("display", "block");

      var submit_url="/api/budgets";
      var submit_type='POST';
      if(vm.form_id!=0){
        submit_url="/api/budgets/"+vm.form_id;
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

            set_form_empty();

            loader.css("display", "none");
            flash_message.html('<div class="box box-widget"><p class="text-green" style="text-align:center !important;padding: 5px;"><b>Success updated data</b></p></div>');
        }.bind(this),
        error: function(xhr, status, err) {
            // console.log(xhr.responseText)
            var message="<div class='alert alert-danger'>";

            var list_error=xhr.responseJSON.errors;
            for(var error in list_error){
                message+=error+": "+list_error[error]+"</br>";
            }
            message+= "</div>";

            loader.css("display", "none");
            vm.form_message=message;
        }.bind(this)
      });
      return false;
    });

    //submit add paying form
    $('body').on('submit',"#transaction-form", function () {
        var csrf = document.querySelector("meta[name=csrf]").content;

        loader.css("display", "block");
        vm.trans_date =$('#trans-date').val();
        var d=new Date(vm.trans_date);
        var month=d.getMonth()+1;
        var date_convert=d.getFullYear()+"-"+(month>9 ? '' : '0') + month+"-"+(d.getDate()>9 ? '' : '0') + d.getDate();
        
        var budget_data = vm.data.find(x => x.id == vm.form_id)

        $.ajax({
            url: "/api/wallets",
            dataType: 'json',
            type: "POST",
            headers: {
                "X-CSRF-TOKEN": csrf 
            },
            data: {
                wallet: {
                    note: vm.trans_note,
                    date: date_convert,
                    amount: vm.trans_amount,
                    category: budget_data.category,
                    currency: vm.trans_currency,
                    account: vm.trans_account,
                    type: 2, //expense type
                    inserted_by: user_id,
                    updated_by: user_id
                }
            },
            success: function(data) {
                vm.trans_note='';
                vm.trans_date='';
                vm.trans_amount='';
                vm.trans_currency='';
                vm.trans_account='';
                vm.form_id=0;

                refresh_data();

                loader.css("display", "none");
                flash_message.html('<div class="box box-widget"><p class="text-green" style="text-align:center !important;padding: 5px;"><b>Success add transaction, check it from \'Detail\' button!</b></p></div>');
            }.bind(this),
            error: function(xhr, status, err) {
              var message="<div class='alert alert-danger'>";

              var list_error=xhr.responseJSON.errors;
              for(var error in list_error){
                  message+=error+": "+list_error[error]+"</br>";
              }
              message+= "</div>";

              loader.css("display", "none");
              vm.form_message=message;
            }.bind(this)
        });
        return false;
    });

    var toggle_title=$("#toggle-title");
    var o = $($.AdminLTE.options.controlSidebarOptions);
    var sidebar = $(o.selector);

    $('body').on('focus','.datepicker',function(){
        $(this).datepicker({autoclose:true});
    });

    $('body').on("click",'.toggle-event', function (e) {
        e.preventDefault();
        flash_message.html("");
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
          }
          else{
            var row_id = $(this).attr('id').substr(6);
            var data = vm.data.find(x => x.id == row_id)
            vm.form_id=row_id;
            toggle_title.append("Update Budget for '"+data.note+"'");

            vm.form_note=data.note;
            vm.form_month=data.month_source;
            vm.form_year=data.year;
            vm.form_amount=data.amount;
            vm.form_category=data.category;
            vm.form_currency=data.currency;
          }
        }
        else if(dataid=='addtransaction'){
          var row_id = $(this).attr('id').substr(6);
          var data = vm.data.find(x => x.id == row_id)
          vm.form_id=row_id;
          toggle_title.append("Add Transaction '"+data.category_label+" "+data.month+" "+data.year+"'");

          vm.isAdd=false;
          vm.isAddTransaction=true;
          vm.isDetail=false;
        }
        else{ 
          var row_id = $(this).attr('id').substr(6);
          var data = vm.data.find(x => x.id == row_id)
          vm.form_id=row_id;
          toggle_title.append("Detail '"+data.category_label+" "+data.month+" "+data.year+"'");


          $.getJSON("/api/wallets/budget/"+data.id, (response) => { 
              vm.transactions = response.data;
          });
          vm.isAdd=false;
          vm.isAddTransaction=false;
          vm.isDetail=true;
        }
    });

    $('.toggle-hide').on("click", function () {
      flash_message.html("");
      if (o.slide) {
        sidebar.removeClass('control-sidebar-open');
      } else {
        $('body').removeClass('control-sidebar-open');
      }
    });

    $('body').on('click','.delete-data', function(e) {
        e.preventDefault();
        flash_message.html("");
        vm.form_id = $(this).attr('data-id');
        $('#myModal').modal('show');
    });

    $('body').on('click','#btn-yes', function(e) {
        e.preventDefault();
        loader.css("display", "block");
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

    var flash_message=$("#flash-message");
    var loader=$(".loader");
    
    function delete_data(event){
      var submit_url="/api/accounts/"+vm.form_id;
      var submit_type='DELETE';
      loader.css("display", "block");
      $.ajax({
        url: submit_url,
        dataType: 'json',
        type: submit_type,
        headers: {
            "X-CSRF-TOKEN": document.querySelector("meta[name=csrf]").content
        },
        success: function(data) {
          refresh_data();
          set_form_empty();
          
          loader.css("display", "none");
          flash_message.html('<div class="box box-widget"><p class="text-green" style="text-align:center !important;padding: 5px;"><b>Success deleted data</b></p></div>');
        }.bind(this),
        error: function(xhr, status, err) {
          loader.css("display", "none");
          flash_message.html('<div class="box box-widget"><p class="text-red" style="text-align:center !important;padding: 5px;"><b>Fail deleted data</b></p></div>');
          console.log(xhr.responseText)
        }.bind(this)
      });
    }
  }
}