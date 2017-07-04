defmodule Mywallet.PageController do
  use Mywallet.Web, :controller

  alias Mywallet.TimeManager
  alias Mywallet.Auth
  
  plug Guardian.Plug.EnsureAuthenticated, [handler: __MODULE__]

  require Logger

  def index(conn, _params) do
    render conn, "index.html"
  end

  def account(conn, _params) do
    # Mywallet.AccountChannel.broadcast_update(Auth.current_user(conn).id)
    render conn, "account.html"
  end

  def wallet(conn, _params) do
    render conn, "wallet.html"
  end

  def billing(conn, _params) do
    render conn, "billing.html"
  end

  def budget(conn, _params) do
    time_now = 20 #TimeManager.time_now()
    # length = 30
    # time_now = :crypto.strong_rand_bytes(length) |> Base.encode64 |> binary_part(0, length)
    # Logger.info time_now
    render conn, "budget.html", [time_now: time_now]
  end

  def unauthenticated(conn, params) do
    conn
      |> put_flash(:error, "You need to SignIn before enter the apps")
      |> redirect(to: auth_path(conn, :login))
  end
end
