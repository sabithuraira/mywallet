defmodule Mywallet.UserTest do
  use Mywallet.ModelCase

  alias Mywallet.User

  @valid_attrs %{avatar: "some content", email: "some content", encrypt_password: "some content", last_login: %{day: 17, hour: 14, min: 0, month: 4, sec: 0, year: 2010}, name: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = User.changeset(%User{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = User.changeset(%User{}, @invalid_attrs)
    refute changeset.valid?
  end
end
