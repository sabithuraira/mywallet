defmodule Mywallet.Repo.Migrations.UpdateWalletCurrrrency do
  use Ecto.Migration

  def change do
    rename table(:wallets), :currrrency, to: :currency
  end
end
