defmodule Mywallet.BillingController do
  use Mywallet.Web, :controller

  alias Mywallet.Billing

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
    # query = from u in Billing,
    #            where: u.inserted_by == ^id,
    #            order_by: [desc: :id],
    #            select: u
    # billings = Repo.all(query)
    #           |> Repo.preload(:category_rel)

    # render(conn, "index.json", billings: billings)

    billings = Billing.list_billing(id)

    render(conn, "index.json", billings: billings)
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

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(billing)

    send_resp(conn, :no_content, "")
  end
end
