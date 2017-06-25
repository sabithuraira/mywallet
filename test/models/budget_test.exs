defmodule Mywallet.BudgetTest do
  use Mywallet.ModelCase

  alias Mywallet.Budget

  @valid_attrs %{}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Budget.changeset(%Budget{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Budget.changeset(%Budget{}, @invalid_attrs)
    refute changeset.valid?
  end
end
