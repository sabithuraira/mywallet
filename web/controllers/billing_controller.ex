defmodule Mywallet.BillingController do
  use Mywallet.Web, :controller

  alias Mywallet.Billing
  alias Mywallet.Wallet

  # def index(conn, _params) do
  #   billings = Repo.all(Billing)
  #   render(conn, "index.json", billings: billings)
  # end

  def create(conn, %{"billing" => billing_params}) do
    changeset = Billing.changeset(%Billing{}, billing_params)

    case Repo.insert(changeset) do
      {:ok, billing} ->
        preload_data = Repo.preload(billing, :category_rel)
        conn
        |> put_status(:created)
        |> put_resp_header("location", billing_path(conn, :show, preload_data))
        |> render("show.json", billing: preload_data)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Mywallet.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    billings = Billing.list_billing(id)

    render(conn, "index.json", billings: billings)
  end

  def resume(conn, %{"id" => id, "month" => month, "year" => year} = params) do
    billing = Billing.resume(params)
    render(conn, "resume_total.json", billing: billing)
  end

  def update(conn, %{"id" => id, "billing" => billing_params}) do
    billing = Repo.get!(Billing, id)
    changeset = Billing.changeset(billing, billing_params)

    case Repo.update(changeset) do
      {:ok, billing} ->
        preload_data = Repo.preload(billing, :category_rel)
        render(conn, "show.json", billing: preload_data)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Mywallet.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    billing = Repo.get!(Billing, id)

    # query paid off data from wallet
    paid_off_data = Repo.all(from a in Wallet, select: count(a.id), where: a.billing_id == ^id)
    
    case Enum.at(paid_off_data,0) do
      0 ->
        # if have no data for paid off, just delete it
        Repo.delete!(billing)
        # send_resp(conn, :no_content, "")
        conn
          |> put_status(:ok)
          |> render(Mywallet.ChangesetView, "message.json", %{ status: :ok, msg: "Success"})
      _ ->
        conn
          |> put_status(:ok)
          |> render(Mywallet.ChangesetView, "message.json", %{ status: :ok, msg: "Cant completed this action. There's paid off data for this bill"})
    end
  end

end
