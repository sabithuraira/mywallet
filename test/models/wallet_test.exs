defmodule Mywallet.WalletTest do
  use Mywallet.ModelCase

  alias Mywallet.Wallet

  @valid_attrs %{account: 42, amount: "120.5", category: 42, currrrency: "some content", date: %{day: 17, month: 4, year: 2010}, note: "some content", type: 42}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Wallet.changeset(%Wallet{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Wallet.changeset(%Wallet{}, @invalid_attrs)
    refute changeset.valid?
  end
end
