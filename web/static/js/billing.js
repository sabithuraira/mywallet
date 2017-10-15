import {Socket} from "phoenix"
import {GlobalData} from "./globaldata"

export var Billing = {
  run: function(){
    var user_token = document.querySelector("meta[name=channel_token]").content;
    var user_id = document.querySelector("meta[name=channel_id]").content;

    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    var vm = new Vue({  
      el: "#billing_list",
      data: {
        current_month: (new Date().getMonth()) + 1,
        current_year: (new Date().getYear()) + 1900,
        resume:{
            total_billing:"",
            total_pay:""
        },
        data: [],
        categories: [],
        currencies: [],
        accounts: [],
        details: [],
        // selectedId: 0,
        isAdd: false,
        isAddTransaction: false,
        isDetail: false,
        isRecurring: false,
        isUpdate: true,

        form_message:'',
        form_id:0,
        form_note:'',
        form_amount:0,
        form_category:'',
        form_currency:'',
        form_date:'',
        recurring_cycle:'',
        recurring_enddate:'',
        
        trans_date:'',
        trans_amount:'',
        trans_currency: '',
        trans_account:'',
    },
      methods: {
        updateArray: function (result) {

          var obj_data = result.data;
          var data_index = this.data.findIndex(x => x.id == this.form_id)

          this.data[data_index].note = obj_data.note; 
          this.data[data_index].date = obj_data.date; 
          this.data[data_index].amount = obj_data.amount; 
          this.data[data_index].category = obj_data.category; 
          this.data[data_index].currency = obj_data.currency;
        },
      },
      computed: {
        currentLabelMonth: function () {
          return monthNames[this.current_month]
        }
      }
    });
    

    let container = document.getElementById("billing_list")

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
      });
      // })
      // .receive("error", reason => console.log("failed to join ha", reason))


    function refresh_data(){
      $.getJSON("/api/billings/"+user_id, (response) => { 
          vm.data = response.data;
      });

      vm.current_month=7;

      $.getJSON("/api/billings/resume/"+user_id+"/"+vm.current_month+"/"+vm.current_year, (response) => {
          vm.resume = response;
      });
    }

    //click button submit on billing data
    $('body').on('submit',"#data-form", function () {
      vm.form_date     =$('#form-date').val();

      loader.css("display", "block");
      var d=new Date(vm.form_date);
      var month=d.getMonth()+1;
      var date_convert=d.getFullYear()+"-"+(month>9 ? '' : '0') + month+"-"+(d.getDate()>9 ? '' : '0') + d.getDate();

      var csrf = document.querySelector("meta[name=csrf]").content;

      var submit_url="/api/billings";
      var submit_type='POST';
      if(vm.form_id!=0){
        submit_url="/api/billings/"+vm.form_id;
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
          billing: {
            note: vm.form_note,
            date: date_convert,
            amount: vm.form_amount,
            category: vm.form_category,
            currency: vm.form_currency,
            inserted_by: user_id,
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
        
        var billing_data = vm.data.find(x => x.id == vm.form_id)

        $.ajax({
            url: "/api/wallets",
            dataType: 'json',
            type: "POST",
            headers: {
                "X-CSRF-TOKEN": csrf 
            },
            data: {
                wallet: {
                    note: "[Pay Billing] "+billing_data.note,
                    date: date_convert,
                    amount: vm.trans_amount,
                    category: billing_data.category,
                    currency: vm.trans_currency,
                    account: vm.trans_account,
                    type: 2,
                    inserted_by: user_id,
                    updated_by: user_id,
                    billing_id: billing_data.id
                }
            },
            success: function(data) {
                vm.trans_date='';
                vm.trans_amount='';
                vm.trans_currency='';
                vm.trans_account='';
                vm.form_id=0;
                loader.css("display", "none");
                flash_message.html('<div class="box box-widget"><p class="text-green" style="text-align:center !important;padding: 5px;"><b>Success updated data</b></p></div>');
                
                refresh_data();
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

    $('body').on("click", '#form-recurring', function () {
        vm.isRecurring= !vm.isRecurring;
    });

    $('body').on('focus','.datepicker',function(){
        $(this).datepicker({autoclose:true});
    });

    $('body').on("click", '.toggle-event', function (e) {
        e.preventDefault();
        flash_message.html("");
        if (o.slide) {
          sidebar.addClass('control-sidebar-open');
        } else {
          $('body').addClass('control-sidebar-open');
        }

        toggle_title.html('');
        var dataid = $(this).data('id');
        set_form_empty();
        
        if(dataid=='adddata'){
          vm.isAdd=true;
          vm.isAddTransaction=false;
          vm.isDetail=false;

          if($(this).attr('id')=='add'){
            vm.isUpdate=true;
            vm.form_date=GlobalData.currentDate();
            toggle_title.append("Add Billing");
          }
          else{
            vm.isUpdate=false;
            toggle_title.append("Update Billing");
            var row_id = $(this).attr('id').substr(6);
            var data = vm.data.find(x => x.id == row_id)
            
            vm.form_id=row_id;
            vm.form_note=data.note;
            vm.form_amount=data.amount;
            vm.form_category=data.category;
            vm.form_currency=data.currency;
            vm.form_date=data.source_date;
          }
        }
        else if(dataid=='addtransaction'){
            var row_id = $(this).attr('id').substr(6);
            vm.form_id=row_id;
            var data = vm.data.find(x => x.id == row_id)

            toggle_title.append("Add Transaction for '"+data.note+"'");


            vm.isAdd=false;
            vm.isAddTransaction=true;
            vm.isDetail=false;
        }
        else{ 
            var row_id = $(this).attr('id').substr(6);
            vm.form_id=row_id;
            var data = vm.data.find(x => x.id == row_id)

            toggle_title.append("Detail Transaction for '"+data.note+"'");

            $.getJSON("/api/wallets/billing/"+data.id, (response) => { 
                vm.details = response.data;
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
      vm.form_note='';
      vm.form_amount='';
      vm.form_date='';
      vm.form_category='';
      vm.form_currency='';
    }

    var flash_message=$("#flash-message");
    var loader=$(".loader");

    function delete_data(event){
      var submit_url="/api/billings/"+vm.form_id;
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
          if(data.message=='Success'){
            flash_message.html('<div class="box box-widget"><p class="text-green" style="text-align:center !important;padding: 5px;"><b>Success</b></p></div>');
          }
          else{
            flash_message.html('<div class="box box-widget"><p class="text-red" style="text-align:center !important;padding: 5px;"><b>'+ data.message +'</b></p></div>');
          }
        }.bind(this),
        error: function(xhr, status, err) {
          loader.css("display", "none");
            console.log(xhr.responseText)
        }.bind(this)
      });
    }

  }
}