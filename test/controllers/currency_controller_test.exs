defmodule Mywallet.CurrencyControllerTest do
  use Mywallet.ConnCase

  alias Mywallet.Currency
  @valid_attrs %{inserted_by: 42, name: "some content", note: "some content", updated_by: 42}
  @invalid_attrs %{}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, currency_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    currency = Repo.insert! %Currency{}
    conn = get conn, currency_path(conn, :show, currency)
    assert json_response(conn, 200)["data"] == %{"id" => currency.id,
      "name" => currency.name,
      "note" => currency.note,
      "inserted_by" => currency.inserted_by,
      "updated_by" => currency.updated_by}
  end

  test "renders page not found when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, currency_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, currency_path(conn, :create), currency: @valid_attrs
    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(Currency, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, currency_path(conn, :create), currency: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    currency = Repo.insert! %Currency{}
    conn = put conn, currency_path(conn, :update, currency), currency: @valid_attrs
    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(Currency, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    currency = Repo.insert! %Currency{}
    conn = put conn, currency_path(conn, :update, currency), currency: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    currency = Repo.insert! %Currency{}
    conn = delete conn, currency_path(conn, :delete, currency)
    assert response(conn, 204)
    refute Repo.get(Currency, currency.id)
  end
end
