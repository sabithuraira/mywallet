defmodule Mywallet.AccountController do
  use Mywallet.Web, :controller

  alias Mywallet.Account
  alias Mywallet.Auth
  
  # def index(conn, _params) do
  #   query = from u in Account,
  #              order_by: [desc: :id],
  #              select: u
  #   accounts = Repo.all(query)
  #   render(conn, "index.json", accounts: accounts)
  # end

  def create(conn, %{"account" => account_params}) do
    changeset = Account.changeset(%Account{}, account_params)

    case Repo.insert(changeset) do
      {:ok, account} ->
        conn
        # Mywallet.AccountChannel.broadcast_update(Auth.current_user(conn).id)
        |> put_status(:created)
        |> put_resp_header("location", account_path(conn, :show, account))
        |> render("show.json", account: account)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Mywallet.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    # account = Repo.get!(Account, id)
    query = from u in Account,
               where: u.created_by == ^id,
               order_by: [desc: :id],
               select: u
    accounts = Repo.all(query)

    render(conn, "index.json", accounts: accounts)
  end

  def update(conn, %{"id" => id, "account" => account_params}) do
    account = Repo.get!(Account, id)
    changeset = Account.changeset(account, account_params)

    case Repo.update(changeset) do
      {:ok, account} ->
        render(conn, "show.json", account: account)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Mywallet.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    account = Repo.get!(Account, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(account)

    send_resp(conn, :no_content, "")
  end
end
