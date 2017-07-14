defmodule Mywallet.BudgetView do
  use Mywallet.Web, :view

  def render("index.json", %{budgets: budgets}) do
    %{data: render_many(budgets, Mywallet.BudgetView, "budget.json")}
  end

  def render("show.json", %{budget: budget}) do
    %{data: render_one(budget, Mywallet.BudgetView, "budget.json")}
  end

  def render("budget.json", %{budget: budget}) do
    %{
        id:         budget.id,
        currency:   budget.currency,
        category:   budget.category,
        month:      Timex.format!({budget.year,budget.month,18}, "%B", :strftime),
        year:       budget.year,
        amount:     budget.amount,
        note:       budget.note,
        created_by: budget.created_by,
        updated_by: budget.updated_by,
        category_label: budget.category_rel.name
    }
  end
end
