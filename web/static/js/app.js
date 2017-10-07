// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"
import "admin-lte/bootstrap/js/bootstrap.min.js"
import "admin-lte/plugins/fastclick/fastclick.js"
import "admin-lte/dist/js/app.js"
import "admin-lte/plugins/sparkline/jquery.sparkline.min.js"
import "admin-lte/plugins/jvectormap/jquery-jvectormap-1.2.2.min.js"
import "admin-lte/plugins/jvectormap/jquery-jvectormap-world-mill-en.js"
import "admin-lte/plugins/slimScroll/jquery.slimscroll.min.js"
import "admin-lte/plugins/chartjs/Chart.min.js"
import "admin-lte/plugins/datepicker/bootstrap-datepicker.js";
//import "admin-lte/dist/js/pages/dashboard2.js"
//import "admin-lte/dist/js/demo.js"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"

import { Budget } from "./budget";
import { Account } from "./account";
import { Currency } from "./currency";
import { Category } from "./category";
import { Wallet } from "./wallet";
import { Billing } from "./billing";
import { Navigation } from "./navigation";

Vue.component('my-component', {
  template: '<div>A custom component!</div>'
})

var App = {
  c_navigation: function(){ Navigation.run();},
  c_budget: function(){ Budget.run();},
  c_account: function(){ Account.run();},
  c_currency: function(){ Currency.run();},
  c_category: function(){ Category.run();},
  c_wallet: function(){ Wallet.run();},
  c_billing: function(){ Billing.run();}
};

module.exports = {
  App: App
};


Vue.component('delete-form', {
  template: `<div class="modal fade" id="myModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-body">
              <p>Are you sure want to delete this item?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>
              <button id="btn-yes" type="button" class="btn btn-primary">Yes</button>
            </div>
          </div>
        </div>
      </div>`,
})

Vue.component('simple-form', {
  template: `<form role='form' id='data-form'>
        <div id="form-message"></div>

        <div class='form-group'>
          <p>Name</p>
          <input type='hidden' id='form-id'>
          <input type='text' id='form-name' class='form-control input-sm' placeholder='Enter name'>
        </div>

        <div class='form-group'>
          <p>Note</p>
          <input type='text' id='form-note' class='form-control input-sm' placeholder='Enter note'>
        </div>

      <div class='box-footer'>
        <button type='submit' id='btn-submit' class='btn btn-primary'>Submit</button>
      </div>
    </form>`,
})