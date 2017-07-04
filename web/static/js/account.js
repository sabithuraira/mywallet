import {Socket} from "phoenix"

export var Account = {
  run: function(){
    let container = document.getElementById("account_list")
    let socket = new Socket("/socket")
    socket.connect()

    let accountChannel = socket.channel("account:2")
    accountChannel.on("update", data => {
      data.data.forEach(function(row) {
        let rowElement = document.createElement("tr",{
          'data-toogle': 'collapse',
          'data-target': 'h',
          'class' : 'accordion-toggle'
        })
        rowElement.innerHTML = "<td>input type='checkbox' /></td>"
          + "<td>${row.name}</td>"
          + "<td>${row.note}</td>";

        container.appendChild(rowElement)
      });
    })

    accountChannel.join()
    .receive("ok", resp => {
      // console.log("joined account channel", resp);
      $.getJSON("http://localhost:4000/api/accounts", (response) => { 
          container.innerHTML='';
          response.data.forEach(function(row) {
            let rowElement = document.createElement("tr",{
              'data-toogle': 'collapse',
              'data-target': row.id,
              'class' : 'accordion-toggle'
            })
            rowElement.innerHTML = '<td><input type="checkbox" /></td>'
              + '<td>'+row.name+'</td>'
              + '<td>'+(row.note==null ? "" : row.note)+'</td>';

            container.appendChild(rowElement)
          });
      });
    })
    .receive("error", reason => console.log("failed to join ha", reason))
  }
}