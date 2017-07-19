defmodule Mywallet.Repo.Migrations.CreateBilling do
  use Ecto.Migration

  def change do
    create table(:billings) do
      add :note, :string
      add :category, :integer
      add :amount, :decimal
      add :currency, :string
      add :date, :date
      add :inserted_by, :integer
      add :updated_by, :integer

      timestamps()
    end

  end
end
