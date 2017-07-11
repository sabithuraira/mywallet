defmodule Mywallet.Repo.Migrations.UpdateBudgetTable do
  use Ecto.Migration

  def change do
    alter table(:budgets) do
      add :category, :integer
    end
  end
end
