defmodule Mywallet.CurrencyTest do
  use Mywallet.ModelCase

  alias Mywallet.Currency

  @valid_attrs %{inserted_by: 42, name: "some content", note: "some content", updated_by: 42}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Currency.changeset(%Currency{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Currency.changeset(%Currency{}, @invalid_attrs)
    refute changeset.valid?
  end
end
