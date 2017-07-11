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
    render conn, "account.html"
  end

  def category(conn, _params) do
    render conn, "category.html"
  end

  def currency(conn, _params) do
    render conn, "currency.html"
  end

  def wallet(conn, _params) do
    render conn, "wallet.html"
  end

  def billing(conn, _params) do
    render conn, "billing.html"
  end

  def budget(conn, _params) do
    render conn, "budget.html"
  end

  def unauthenticated(conn, params) do
    conn
      |> put_flash(:error, "You need to SignIn before enter the apps")
      |> redirect(to: auth_path(conn, :login))
  end
end
