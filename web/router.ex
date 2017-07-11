defmodule Mywallet.Router do
  use Mywallet.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :browser_session do
    plug Guardian.Plug.VerifySession
    plug Guardian.Plug.LoadResource
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Mywallet do
    pipe_through [:browser, :browser_session] # Use the default browser stack

    get "/", PageController, :index
    get "/budget", PageController, :budget
    get "/wallet", PageController, :wallet
    get "/billing", PageController, :billing
    get "/account", PageController, :account
    get "/currency", PageController, :currency
    get "/category", PageController, :category
    # get "/login", PageController, :login
    resources "/users", UserController
    
    get "/register", AuthController, :register
    post "/register", AuthController, :save
    get "/login", AuthController, :login
    post "/login", AuthController, :authenticate
    get "/logout", AuthController, :logout
  end

  scope "/auth", Mywallet do
    pipe_through :browser

    get "/:provider", AuthController, :request
    get "/:provider/callback", AuthController, :callback
  end

  # Other scopes may use custom stacks.
  scope "/api", Mywallet do
    pipe_through :api

    resources "/budgets", BudgetController, except: [:new, :edit]
    resources "/accounts", AccountController, except: [:new, :edit]
    resources "/currencies", CurrencyController, except: [:new, :edit]
    resources "/categories", CategoryController, except: [:new, :edit]
  end
end
