defmodule Mywallet.WalletView do
  use Mywallet.Web, :view

  def render("index.json", %{wallets: wallets}) do
    %{data: render_many(wallets, Mywallet.WalletView, "wallet.json")}
  end

  def render("show.json", %{wallet: wallet}) do
    %{data: render_one(wallet, Mywallet.WalletView, "wallet.json")}
  end

  def render("wallet.json", %{wallet: wallet}) do
    %{id: wallet.id,
      note: wallet.note,
      currrrency: wallet.currrrency,
      amount: wallet.amount,
      date: wallet.date,
      account: wallet.account,
      category: wallet.category,
      type: wallet.type}
  end
end
