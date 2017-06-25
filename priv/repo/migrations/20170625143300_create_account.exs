defmodule Mywallet.Repo.Migrations.CreateAccount do
  use Ecto.Migration

  def change do
    create table(:accounts) do
      add :name, :name
      add :note, :string
      add :created_by, :integer
      add :updated_by, :integer

      timestamps()
    end

  end
end
