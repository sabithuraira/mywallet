defmodule Mywallet.CurrencyController do
  use Mywallet.Web, :controller

  alias Mywallet.Currency

  def index(conn, _params) do
    currencies = Repo.all(Currency)
    render(conn, "index.json", currencies: currencies)
  end

  def create(conn, %{"currency" => currency_params}) do
    changeset = Currency.changeset(%Currency{}, currency_params)

    case Repo.insert(changeset) do
      {:ok, currency} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", currency_path(conn, :show, currency))
        |> render("show.json", currency: currency)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Mywallet.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    currency = Repo.get!(Currency, id)
    render(conn, "show.json", currency: currency)
  end

  def update(conn, %{"id" => id, "currency" => currency_params}) do
    currency = Repo.get!(Currency, id)
    changeset = Currency.changeset(currency, currency_params)

    case Repo.update(changeset) do
      {:ok, currency} ->
        render(conn, "show.json", currency: currency)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Mywallet.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    currency = Repo.get!(Currency, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(currency)

    send_resp(conn, :no_content, "")
  end
end
