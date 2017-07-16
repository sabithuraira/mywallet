defmodule Mywallet.Repo.Migrations.UpdateWallet do
  use Ecto.Migration

  def change do
    alter table(:wallets) do
      add :inserted_by, :integer
      add :updated_by, :integer
    end
  end
end
