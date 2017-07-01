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
import {Socket} from "phoenix"

var App = {
  c_time: function ctime() {
        // We set an explicit id on the div in our HTML to allow
        // us to easily access it and replace its content.
        let container = document.getElementById("clock")
        // The code on GitHub connects to "/time/socket", this is due
        // to how TonicTime is deployed. The socket endpoint just needs
        // to match the socket created in the TonicTime.Endpoint module.
        let socket = new Socket("/socket")
        socket.connect()

        let timeChannel = socket.channel("time:now")

        // When an `update` message is received we replace the contents
        // of the "clock" element with server-side rendered HTML.
        timeChannel.on("update", ({html}) => container.innerHTML = html)

        // Attempt to connect to the WebSocket (Channel).
        timeChannel.join()
        .receive("ok", resp => console.log("joined time channel", resp))
        .receive("error", reason => console.log("failed to join ha", reason))
  }
};

module.exports = {
  App: App
};
