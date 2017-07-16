defmodule Mywallet.WalletController do
  use Mywallet.Web, :controller

  alias Mywallet.Wallet

  # def index(conn, _params) do
  #   wallets = Repo.all(Wallet)
  #   render(conn, "index.json", wallets: wallets)
  # end

  def create(conn, %{"wallet" => wallet_params}) do
    changeset = Wallet.changeset(%Wallet{}, wallet_params)

    case Repo.insert(changeset) do
      {:ok, wallet} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", wallet_path(conn, :show, wallet))
        |> render("show.json", wallet: wallet)
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
              # |> Repo.preload(:category_rel)

    render(conn, "index.json", wallets: wallets)
  end

  def update(conn, %{"id" => id, "wallet" => wallet_params}) do
    wallet = Repo.get!(Wallet, id)
    changeset = Wallet.changeset(wallet, wallet_params)

    case Repo.update(changeset) do
      {:ok, wallet} ->
        render(conn, "show.json", wallet: wallet)
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
