import {Socket} from "phoenix"
import {GlobalData} from "./globaldata"

export var Wallet = {
  run: function(){
    var user_token = document.querySelector("meta[name=channel_token]").content;
    var user_id = document.querySelector("meta[name=channel_id]").content;

    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    var vm = new Vue({  
      el: "#wallet_list",
      data: {
        current_month: (new Date().getMonth()) + 1,
        current_year: (new Date().getYear()) + 1900,
        resume:{
            total:"",
            total_expense:"",
            total_income:"",
        },
        data: [],
        categories: [],
        currencies: [],
        accounts: [],
        types: [
          {id:1, name: "Income" },
          {id:2, name: "Expense" },
          {id:3, name: "Transfer" },
        ],
        isRecurring: false,
        isUpdate: true,
        selectedId: 0,
        form_message:'',
        // month: ["January", "February", "March", "April", "May", "June",
        //   "July", "August", "September", "October", "November", "Desember"],
        year: [],
      },
      methods: {
        updateArray: function (result) {

          var obj_data = result.data;
          var data_index = this.data.findIndex(x => x.id == this.selectedId);

          this.data[data_index].account = obj_data.account;
          this.data[data_index].account_label = obj_data.account_label;
          this.data[data_index].amount = obj_data.amount;
          this.data[data_index].category = obj_data.category;
          this.data[data_index].category_label = obj_data.category_label;
          this.data[data_index].currency = obj_data.currency;
          this.data[data_index].date = obj_data.date;
          this.data[data_index].note = obj_data.note;
          this.data[data_index].source_date = obj_data.source_date;
          this.data[data_index].type = obj_data.type; 
        },
      }
    });

    let container = document.getElementById("wallet_list")

    $( document ).ready(function() {
      refresh_data(); 
      
      // $.getJSON("/api/categories/"+user_id, (response) => { 
      $.getJSON("/api/categories/"+user_id, (response) => { 
          vm.categories = response.data;
      });

      $.getJSON("api/currencies/", (response) => { 
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
      $.getJSON("/api/wallets/"+user_id, (response) => { 
          vm.data = response.data;
      });

      $.getJSON("/api/wallets/resume/"+user_id+"/"+vm.current_month+"/"+vm.current_year, (response) => {
          vm.resume = response;
      });
    }

    //click button submit
    $('body').on('submit',"#data-form", function () {
      var form_id       =$('#form-id').val();
      var form_note     =$('#form-note').val();
      var form_date     =$('#form-date').val();
      var form_amount   =$('#form-amount').val();
      var form_category =$('#form-category').val();
      var form_currency =$('#form-currency').val();
      var form_account  =$('#form-account').val();
      var form_type     =$('#form-type').val();

      var csrf = document.querySelector("meta[name=csrf]").content;
      loader.css("display", "block");

      var submit_url="/api/wallets";
      var submit_type='POST';
      if(form_id!=0){
        submit_url="/api/wallets/"+form_id;
        submit_type='PUT';
      }

      var d=new Date(form_date);
      var month=d.getMonth()+1;
      var date_convert=d.getFullYear()+"-"+(month>9 ? '' : '0') + month+"-"+(d.getDate()>9 ? '' : '0') + d.getDate();
      
      $.ajax({
        url: submit_url,
        dataType: 'json',
        type: submit_type,
        headers: {
            "X-CSRF-TOKEN": csrf 
        },
        data: {
          wallet: {
            note: form_note,
            date: date_convert,
            amount: form_amount,
            category: form_category,
            currency: form_currency,
            account: form_account,
            type: form_type,
            inserted_by: user_id,
            updated_by: user_id
          }
        },
        success: function(data) { 
            if(form_id!=0)
              vm.updateArray(data);
            else
              refresh_data();

            $('#form-id').val(0);
            $('#form-note').val('');
            $('#form-amount').val('');
            $('#form-date').val('');

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
            console.log(xhr.responseText)
        }.bind(this)
      });
      return false;
    });

    var toggle_title=$("#toggle-title");
    var o = $($.AdminLTE.options.controlSidebarOptions);
    var sidebar = $(o.selector);

    $('#form-recurring').on("click", function () {
      vm.isRecurring= !vm.isRecurring;
    });

    // $('.datepicker').datepicker({autoclose: true});
    //it will work on append element
    $('body').on('focus','.datepicker',function(){
        $(this).datepicker({autoclose:true});
    });
    
    //colapse detail transaction
    $('body').on("click",'.toggle-detail', function (e) {
      flash_message.html("");
      var target = $(this).data('target');
      $(target).collapse('toggle')
    });
    
    $('body').on("click",'.toggle-event', function (e) {
      //prevent run this code by parent-DOM (collapse detail function)
      e.stopPropagation();
      flash_message.html("");

        if (o.slide) {
          sidebar.addClass('control-sidebar-open');
        } else {
          $('body').addClass('control-sidebar-open');
        }

        var dataid = $(this).data('id');

        toggle_title.html("");
        if(dataid=='add'){
          vm.isUpdate=true;
          toggle_title.append("Add Transaction");

          $('#form-id').val(0);
          $('#form-note').val('');
          $('#form-amount').val('');
          $('#form-date').val(GlobalData.currentDate());
          vm.selectedId=0;
        }
        else{
          vm.isUpdate=false;
          toggle_title.append("Update Transaction");
          var row_id = $(this).attr('id').substring(4);
          var data = vm.data.find(x => x.id == row_id)
          vm.selectedId=row_id;
          
          $('#form-id').val(data.id);
          $('#form-note').val(data.note);
          $('#form-date').val(data.source_date);
          $('#form-amount').val(data.amount);
          $('#form-category').val(data.category);
          $('#form-currency').val(data.currency);
          $('#form-account').val(data.account);
          $('#form-type').val(data.type);
        }
      
    });

    // $('body').on("click",'#btn-refresh', function (e) {
    //   refresh_data();
    // });

    $('.toggle-hide').on("click", function () {
      if (o.slide) {
        sidebar.removeClass('control-sidebar-open');
      } else {
        $('body').removeClass('control-sidebar-open');
      }
    });

    $('body').on('click','.delete-data', function(e) {
        e.stopPropagation();
        flash_message.html("");
        vm.selectedId = $(this).attr('data-id');
        $('#myModal').modal('show');
    });

    $('body').on('click','#btn-yes', function(e) {
        e.preventDefault();
        delete_data(e)
        $('#myModal').modal('hide');
    });
    
    var flash_message=$("#flash-message");
    var loader=$(".loader");

    function delete_data(event){
      var submit_url="/api/wallets/"+vm.selectedId;
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
          vm.selectedId=0;
          refresh_data();
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

  } // end of run
}