defmodule Mywallet.PageController do
  use Mywallet.Web, :controller
  plug Guardian.Plug.EnsureAuthenticated, [handler: __MODULE__]

  def index(conn, _params) do
    render conn, "index.html"
  end

  def account(conn, _params) do
    render conn, "account.html"
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
