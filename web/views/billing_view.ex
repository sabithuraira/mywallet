defmodule Mywallet.BillingView do
  use Mywallet.Web, :view

  def render("index.json", %{billings: billings}) do
    %{data: render_many(billings, Mywallet.BillingView, "resume.json")}
  end

  def render("show.json", %{billing: billing}) do
    %{data: render_one(billing, Mywallet.BillingView, "billing.json")}
  end

  def render("resume.json", %{billing: billing}) do
    %{
      id: billing.id,
      note: billing.note,
      category: billing.category,
      amount: billing.amount,
      currency: billing.currency,
      source_date: Timex.format!(billing.date, "{0M}/{0D}/{YYYY}"),
      date: Timex.format!(billing.date, "{D} {Mfull} {YYYY}"),
      inserted_by: billing.inserted_by,
      updated_by: billing.updated_by,
      paying: billing.paying,
      residual: billing.residual,
      category_label: billing.category_label
    }
  end

  def render("billing.json", %{billing: billing}) do
    %{
      id: billing.id,
      note: billing.note,
      category: billing.category,
      amount: billing.amount,
      currency: billing.currency,
      # date: billing.date,
      source_date: Timex.format!(billing.date, "{0M}/{0D}/{YYYY}"),
      date: Timex.format!(billing.date, "{D} {Mfull} {YYYY}"),
      inserted_by: billing.inserted_by,
      updated_by: billing.updated_by,
      category_label: billing.category_rel.name
    }
  end
end
