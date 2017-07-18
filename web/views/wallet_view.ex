defmodule Mywallet.WalletView do
  use Mywallet.Web, :view

  use Timex
  require Logger

  def render("index.json", %{wallets: wallets}) do
    %{data: render_many(wallets, Mywallet.WalletView, "wallet.json")}
  end

  def render("show.json", %{wallet: wallet}) do
    %{data: render_one(wallet, Mywallet.WalletView, "wallet.json")}
  end

  def render("wallet.json", %{wallet: wallet}) do
    %{
      id: wallet.id,
      note: wallet.note,
      currency: wallet.currency,
      amount: wallet.amount,
      source_date: Timex.format!(wallet.date, "{0M}/{0D}/{YYYY}"),
      date: Timex.format!(wallet.date, "{D} {Mfull} {YYYY}"),
      account: wallet.account,
      category: wallet.category,
      type: wallet.type,
      category_label: wallet.category_rel.name,
      account_label: wallet.account_rel.name
    }
  end
end
