defmodule Mywallet.CategoryTest do
  use Mywallet.ModelCase

  alias Mywallet.Category

  @valid_attrs %{inserted_by: 42, name: "some content", note: "some content", updated_by: 42, user_id: 42}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Category.changeset(%Category{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Category.changeset(%Category{}, @invalid_attrs)
    refute changeset.valid?
  end
end
