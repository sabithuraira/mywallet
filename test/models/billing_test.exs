defmodule Mywallet.BillingTest do
  use Mywallet.ModelCase

  alias Mywallet.Billing

  @valid_attrs %{amount: "120.5", category: 42, currency: "some content", date: %{day: 17, month: 4, year: 2010}, inserted_by: 42, note: "some content", updated_by: 42}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Billing.changeset(%Billing{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Billing.changeset(%Billing{}, @invalid_attrs)
    refute changeset.valid?
  end
end
