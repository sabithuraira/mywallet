defmodule Mywallet.PageController do
  use Mywallet.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
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
end
