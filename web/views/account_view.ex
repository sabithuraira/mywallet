defmodule Mywallet.AccountView do
  use Mywallet.Web, :view

  def render("index.json", %{accounts: accounts}) do
    %{data: render_many(accounts, Mywallet.AccountView, "account.json")}
  end

  def render("show.json", %{account: account}) do
    %{data: render_one(account, Mywallet.AccountView, "account.json")}
  end

  def render("account.json", %{account: account}) do
    %{
        id: account.id,
        name: account.name,
        note: account.note,
        user_id: account.created_by
    }
  end
end
