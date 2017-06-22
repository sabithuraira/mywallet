defmodule Mywallet.Router do
  use Mywallet.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Mywallet do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    get "/budget", PageController, :budget
    get "/wallet", PageController, :wallet
    get "/billing", PageController, :billing
    get "/login", PageController, :login
    get "/register", PageController, :register
    resources "/users", UserController
  end

  # Other scopes may use custom stacks.
  # scope "/api", Mywallet do
  #   pipe_through :api
  # end
end
