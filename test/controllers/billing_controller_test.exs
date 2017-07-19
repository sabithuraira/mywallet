defmodule Mywallet.BillingControllerTest do
  use Mywallet.ConnCase

  alias Mywallet.Billing
  @valid_attrs %{amount: "120.5", category: 42, currency: "some content", date: %{day: 17, month: 4, year: 2010}, inserted_by: 42, note: "some content", updated_by: 42}
  @invalid_attrs %{}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, billing_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    billing = Repo.insert! %Billing{}
    conn = get conn, billing_path(conn, :show, billing)
    assert json_response(conn, 200)["data"] == %{"id" => billing.id,
      "note" => billing.note,
      "category" => billing.category,
      "amount" => billing.amount,
      "currency" => billing.currency,
      "date" => billing.date,
      "inserted_by" => billing.inserted_by,
      "updated_by" => billing.updated_by}
  end

  test "renders page not found when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, billing_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, billing_path(conn, :create), billing: @valid_attrs
    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(Billing, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, billing_path(conn, :create), billing: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    billing = Repo.insert! %Billing{}
    conn = put conn, billing_path(conn, :update, billing), billing: @valid_attrs
    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(Billing, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    billing = Repo.insert! %Billing{}
    conn = put conn, billing_path(conn, :update, billing), billing: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    billing = Repo.insert! %Billing{}
    conn = delete conn, billing_path(conn, :delete, billing)
    assert response(conn, 204)
    refute Repo.get(Billing, billing.id)
  end
end
