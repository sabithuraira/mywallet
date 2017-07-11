defmodule Mywallet.Repo.Migrations.CreateCurrency do
  use Ecto.Migration

  def change do
    create table(:currencies) do
      add :name, :string
      add :note, :string
      add :inserted_by, :integer
      add :updated_by, :integer

      timestamps()
    end

  end
end
