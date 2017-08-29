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

  def render("resume_total.json", %{wallet: wallet}) do
    case wallet do
      [] -> %{total: 0, total_expense: 0, total_income: 0}
      _ -> wallet
    end
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
      billing_id: wallet.billing_id,
      category_label: wallet.category_rel.name,
      account_label: wallet.account_rel.name
    }
  end
end
