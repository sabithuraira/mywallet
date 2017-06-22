defmodule Mywallet.AuthController do
  use Mywallet.Web, :controller

  def login(conn, _params) do
    render conn, "login.html",
      layout: {Mywallet.LayoutView, "login.html"}
  end

  def register(conn, _params) do
    render conn, "register.html",
      layout: {Mywallet.LayoutView, "login.html"}
  end
end
