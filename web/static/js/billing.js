import {Socket} from "phoenix"

export var Billing = {
  run: function(){
    var user_token = document.querySelector("meta[name=channel_token]").content;
    var user_id = document.querySelector("meta[name=channel_id]").content;

    var vm = new Vue({  
      el: "#billing_list",
      data: {
        data: [],
        categories: [],
        currencies: [],
        accounts: [],
        details: [],
        selectedId: 0,
        isAdd: false,
        isAddTransaction: false,
        isDetail: false,
        isRecurring: false,
        form_id:0,
        form_note:'',
        form_amount:0,
        form_category:'',
        form_currency:'',
        form_date:'',
        
        trans_date:'',
        trans_amount:'',
        trans_currency: null,
        trans_account:'',
    },
      methods: {
        updateArray: function (result) {

          var obj_data = result.data;
          var data_index = this.data.findIndex(x => x.id == this.selectedId)

          this.data[data_index].note = obj_data.note; 
          this.data[data_index].date = obj_data.date; 
          this.data[data_index].amount = obj_data.amount; 
          this.data[data_index].category = obj_data.category; 
          this.data[data_index].currency = obj_data.currency;
        },
      }
    });
    

    let container = document.getElementById("billing_list")
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

        $.getJSON("http://localhost:4000/api/accounts/"+user_id, (response) => { 
            vm.accounts = response.data;
        });
      })
      .receive("error", reason => console.log("failed to join ha", reason))


    function refresh_data(){
      $.getJSON("http://localhost:4000/api/billings/"+user_id, (response) => { 
          vm.data = response.data;
      });
    }

    //click button submit on billing data
    $('body').on('submit',"#data-form", function () {
      vm.form_date     =$('#form-date').val();

      var d=new Date(vm.form_date);
      var month=d.getMonth()+1;
      var date_convert=d.getFullYear()+"-"+(month>9 ? '' : '0') + month+"-"+(d.getDate()>9 ? '' : '0') + d.getDate();

      var csrf = document.querySelector("meta[name=csrf]").content;

      var submit_url="http://localhost:4000/api/billings";
      var submit_type='POST';
      if(vm.form_id!=0){
        submit_url="http://localhost:4000/api/billings/"+vm.form_id;
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

            vm.form_id=0;
            vm.form_note='';
            vm.form_amount='';
            vm.form_date='';
        }.bind(this),
        error: function(xhr, status, err) {
            console.log(xhr.responseText)
        }.bind(this)
      });
      return false;
    });

    //submit add paying form
    $('body').on('submit',"#transaction-form", function () {
        var csrf = document.querySelector("meta[name=csrf]").content;

        vm.trans_date =$('#trans-date').val();
        var d=new Date(vm.trans_date);
        var month=d.getMonth()+1;
        var date_convert=d.getFullYear()+"-"+(month>9 ? '' : '0') + month+"-"+(d.getDate()>9 ? '' : '0') + d.getDate();
        
        var billing_data = vm.data.find(x => x.id == vm.selectedId)

        $.ajax({
            url: "http://localhost:4000/api/wallets",
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
                vm.trans_note='';
                vm.trans_date='';
                vm.trans_amount='';
                vm.trans_category='';
                vm.trans_currency='';
                vm.trans_account='';
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

    $('body').on("click", '#form-recurring', function () {
        vm.isRecurring= !vm.isRecurring;
    });

    $('body').on('focus','.datepicker',function(){
        $(this).datepicker({autoclose:true});
    });

    $('body').on("click", '.toggle-event', function () {
        if (o.slide) {
          sidebar.addClass('control-sidebar-open');
        } else {
          $('body').addClass('control-sidebar-open');
        }

        toggle_title.html('');
        var dataid = $(this).data('id');
        
        if(dataid=='adddata'){
          vm.isAdd=true;
          vm.isAddTransaction=false;
          vm.isDetail=false;

          if($(this).attr('id')=='add'){
            toggle_title.append("Add Billing");

            vm.form_id=0;
            vm.form_note='';
            vm.form_amount='';
            vm.form_date='';
            vm.selectedId=0;
          }
          else{
            toggle_title.append("Update Billing");
            var row_id = $(this).attr('id').substr(6);
            var data = vm.data.find(x => x.id == row_id)
            
            vm.selectedId=row_id;

            vm.form_id=data.id;
            vm.form_note=data.note;
            vm.form_amount=data.amount;
            vm.form_category=data.category;
            vm.form_currency=data.currency;
            vm.form_date=data.source_date;
          }
        }
        else if(dataid=='addtransaction'){
            var row_id = $(this).attr('id').substr(6);
            vm.selectedId=row_id;
            var data = vm.data.find(x => x.id == row_id)

            toggle_title.append("Add Transaction for '"+data.note+"'");


            vm.isAdd=false;
            vm.isAddTransaction=true;
            vm.isDetail=false;
        }
        else{ 
            var row_id = $(this).attr('id').substr(6);
            vm.selectedId=row_id;
            var data = vm.data.find(x => x.id == row_id)

            toggle_title.append("Detail Transaction for '"+data.note+"'");

            $.getJSON("http://localhost:4000/api/wallets/billing/"+data.id, (response) => { 
                vm.details = response.data;
            });

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
      var submit_url="http://localhost:4000/api/billings/"+vm.selectedId;
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