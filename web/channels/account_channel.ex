defmodule Mywallet.AccountChannel do
  use Mywallet.Web, :channel

  require Logger

  def join("account:"<> _userid, payload, socket) do
    if authorized?(payload) do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  #  def broadcast_update(userid) do
  #   #  info = "account:"<>Integer.to_string(userid)
  #   data = case HTTPoison.get("http://localhost:4000/api/accounts") do
  #             {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
  #               temp_data = Poison.decode! body
  #               Logger.info inspect(temp_data["data"])
  #               # all_data = Enum.map(temp_data["data"], fn({key, value}) -> 
  #               #     %{"id": value.id, "name": value.name, "note": value.note, "user_id": value.user_id}
  #               # end)
  #               all_data = temp_data["data"]
  #                     |> Enum.reduce([], fn(curr, result) ->
  #                         result ++ [%{"id": curr["id"], "name": curr["name"], "note": curr["note"], "user_id": curr["user_id"]}]
  #                     end)
  #               # Logger.info inspect(all_data)

  #             {:error, %HTTPoison.Error{reason: reason}} ->
  #               # result
  #           end

  #   Logger.info "define data"
  #   Logger.info "account:"<>Integer.to_string(userid)
  #   Logger.info inspect(data)

  #   #  html = Phoenix.View.render_to_string(Mywallet.PageView,"time_now.html",[time_now: time])
  #    # Send the updated HTML to subscribers.
  #   Mywallet.Endpoint.broadcast("account:"<>Integer.to_string(userid), "update",%{data: data})
  #  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (account:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end