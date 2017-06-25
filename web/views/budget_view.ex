defmodule Mywallet.BudgetView do
  use Mywallet.Web, :view

  def render("index.json", %{budgets: budgets}) do
    %{data: render_many(budgets, Mywallet.BudgetView, "budget.json")}
  end

  def render("show.json", %{budget: budget}) do
    %{data: render_one(budget, Mywallet.BudgetView, "budget.json")}
  end

  def render("budget.json", %{budget: budget}) do
    %{id: budget.id}
  end
end
