// import {Socket} from "phoenix"

// export var Time = {
//   run: function(){
//     let container = document.getElementById("clock")
//     let socket = new Socket("/socket")
//     socket.connect()

//     let timeChannel = socket.channel("time:now")
//     timeChannel.on("update", ({html}) => container.innerHTML = html)
//     timeChannel.join()
//     .receive("ok", resp => console.log("joined time channel", resp))
//     .receive("error", reason => console.log("failed to join ha", reason))
//   }
// }