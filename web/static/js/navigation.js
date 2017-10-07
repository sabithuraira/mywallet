import {Socket} from "phoenix"

export var Navigation = {
  run: function(){
    var user_token = document.querySelector("meta[name=channel_token]").content;
    var user_id = document.querySelector("meta[name=channel_id]").content;

    var vm = new Vue({  
      el: "#navigation-bar",
      data: {
        data: []
      }
    });

    $( document ).ready(function() {
      refresh_data();
    });

    function refresh_data(){
      $.getJSON("/api/accounts/"+user_id, (response) => { 
          vm.data = response.data;
      });
    }

  }
}