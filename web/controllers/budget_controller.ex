defmodule Mywallet.BudgetController do
  use Mywallet.Web, :controller
  require Logger

  alias Mywallet.Budget
  alias Mywallet.Category

  # def index(conn, _params) do
  #   budgets = Repo.all(Budget)
  #   render(conn, "index.json", budgets: budgets)
  # end

  def create(conn, %{"budget" => budget_params}) do
    changeset = Budget.changeset(%Budget{}, budget_params)

    case Repo.insert(changeset) do
      {:ok, budget} ->
        preload_data = Repo.preload(budget, :category_rel)
        conn
        |> put_status(:created)
        |> put_resp_header("location", budget_path(conn, :show, preload_data))
        |> render("show.json", budget: preload_data )
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Mywallet.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    # query = from u in Budget,
    #            where: u.created_by == ^id,
    #            order_by: [desc: :id],
    #            select: u
    # budgets = Repo.all(query)
    #           |> Repo.preload(:category_rel)

    budgets = Budget.list_budget(id)

    # Logger.info "test"
    # Logger.info inspect(budgets)

    render(conn, "index.json", budgets: budgets)
  end

  def update(conn, %{"id" => id, "budget" => budget_params}) do
    budget = Repo.get!(Budget, id)
    changeset = Budget.changeset(budget, budget_params)

    case Repo.update(changeset) do
      {:ok, budget} ->
        preload_data = Repo.preload(budget, :category_rel)
        render(conn, "show.json", budget: preload_data)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Mywallet.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    budget = Repo.get!(Budget, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(budget)

    send_resp(conn, :no_content, "")
  end

end
