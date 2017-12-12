defmodule Mywallet.WalletController do
  use Mywallet.Web, :controller

  alias Mywallet.Wallet
  alias Mywallet.Category
  alias Mywallet.Budget

  # def index(conn, _params) do
  #   wallets = Repo.all(Wallet)
  #   render(conn, "index.json", wallets: wallets)
  # end

  def create(conn, %{"wallet" => wallet_params}) do
    changeset = Wallet.changeset(%Wallet{}, wallet_params)

    case Repo.insert(changeset) do
      {:ok, wallet} ->
        preload_data = Repo.preload(wallet, [:category_rel, :account_rel])
        conn
        |> put_status(:created)
        |> put_resp_header("location", wallet_path(conn, :show, preload_data))
        |> render("show.json", wallet: preload_data)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Mywallet.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    query = from u in Wallet,
               where: u.inserted_by == ^id,
               order_by: [desc: :date],
               select: u
    wallets = Repo.all(query)
              |> Repo.preload([:category_rel, :account_rel, :billing_rel])

    render(conn, "index.json", wallets: wallets)
  end

  def toxml(conn, %{"id" => id}) do
    query = from u in Wallet,
               where: u.inserted_by == ^id,
               order_by: [desc: :date],
               select: u
    wallets = Repo.all(query)
              |> Repo.preload([:category_rel, :account_rel, :billing_rel])

    # wallets |> XmlBuilder.generate
    {:person, %{id: 12345}, "Josh"} |> XmlBuilder.generate
  end

  def show_billing(conn, %{"id" => id}) do
    query = from u in Wallet,
               where: u.billing_id == ^id,
               order_by: [desc: :date],
               select: u
    wallets = Repo.all(query)
              |> Repo.preload([:category_rel, :account_rel])

    render(conn, "index.json", wallets: wallets)
  end

  def show_budget(conn, %{"id" => id}) do
    query = from u in Wallet,
              join: b in Budget,
              where: b.id == ^id and 
                b.category==u.category and 
                b.month==fragment("date_part('month', ?)",u.date) and
                b.year==fragment("date_part('year', ?)",u.date),
              order_by: [desc: :date],
              select: u

    wallets = Repo.all(query)
              |> Repo.preload([:category_rel, :account_rel])

    render(conn, "index.json", wallets: wallets)
  end

  def resume(conn, %{"id" => id, "month" => month, "year" => year} = params) do
    wallet = Wallet.resume(params)
    render(conn, "resume_total.json", wallet: wallet)
  end

  def update(conn, %{"id" => id, "wallet" => wallet_params}) do
    wallet = Repo.get!(Wallet, id)
    changeset = Wallet.changeset(wallet, wallet_params)

    case Repo.update(changeset) do
      {:ok, wallet} ->
        preload_data = Repo.preload(wallet, [:category_rel, :account_rel])
        render(conn, "show.json", wallet: preload_data)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Mywallet.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    wallet = Repo.get!(Wallet, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(wallet)

    send_resp(conn, :no_content, "")
  end
end
