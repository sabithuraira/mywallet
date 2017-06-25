defmodule Mywallet.Repo.Migrations.CreateBudget do
  use Ecto.Migration

  def change do
    create table(:budgets) do
      add :currency, :string
      add :month, :integer
      add :year, :integer
      add :amount, :decimal
      add :account, :integer
      add :note, :string
      add :created_by, :integer
      add :updated_by, :integer

      timestamps()
    end

  end
end
