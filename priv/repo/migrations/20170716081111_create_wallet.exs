defmodule Mywallet.Repo.Migrations.CreateWallet do
  use Ecto.Migration

  def change do
    create table(:wallets) do
      add :note, :string
      add :currrrency, :string
      add :amount, :decimal
      add :date, :date
      add :account, :integer
      add :category, :integer
      add :type, :integer

      timestamps()
    end

  end
end
