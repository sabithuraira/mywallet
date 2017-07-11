defmodule Mywallet.Repo.Migrations.CreateCategory do
  use Ecto.Migration

  def change do
    create table(:categories) do
      add :name, :string
      add :note, :string
      add :user_id, :integer
      add :inserted_by, :integer
      add :updated_by, :integer

      timestamps()
    end

  end
end
