defmodule Mywallet.CurrencyView do
  use Mywallet.Web, :view

  def render("index.json", %{currencies: currencies}) do
    %{data: render_many(currencies, Mywallet.CurrencyView, "currency.json")}
  end

  def render("show.json", %{currency: currency}) do
    %{data: render_one(currency, Mywallet.CurrencyView, "currency.json")}
  end

  def render("currency.json", %{currency: currency}) do
    %{id: currency.id,
      name: currency.name,
      note: currency.note,
      inserted_by: currency.inserted_by,
      updated_by: currency.updated_by}
  end
end
