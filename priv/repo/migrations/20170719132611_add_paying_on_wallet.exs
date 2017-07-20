defmodule Mywallet.Repo.Migrations.AddPayingOnWallet do
  use Ecto.Migration

  def change do
    alter table(:wallets) do
      add :billing_id, :integer
    end
  end
end
