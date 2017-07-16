defmodule Mywallet.WalletControllerTest do
  use Mywallet.ConnCase

  alias Mywallet.Wallet
  @valid_attrs %{account: 42, amount: "120.5", category: 42, currrrency: "some content", date: %{day: 17, month: 4, year: 2010}, note: "some content", type: 42}
  @invalid_attrs %{}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, wallet_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    wallet = Repo.insert! %Wallet{}
    conn = get conn, wallet_path(conn, :show, wallet)
    assert json_response(conn, 200)["data"] == %{"id" => wallet.id,
      "note" => wallet.note,
      "currrrency" => wallet.currrrency,
      "amount" => wallet.amount,
      "date" => wallet.date,
      "account" => wallet.account,
      "category" => wallet.category,
      "type" => wallet.type}
  end

  test "renders page not found when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, wallet_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, wallet_path(conn, :create), wallet: @valid_attrs
    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(Wallet, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, wallet_path(conn, :create), wallet: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    wallet = Repo.insert! %Wallet{}
    conn = put conn, wallet_path(conn, :update, wallet), wallet: @valid_attrs
    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(Wallet, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    wallet = Repo.insert! %Wallet{}
    conn = put conn, wallet_path(conn, :update, wallet), wallet: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    wallet = Repo.insert! %Wallet{}
    conn = delete conn, wallet_path(conn, :delete, wallet)
    assert response(conn, 204)
    refute Repo.get(Wallet, wallet.id)
  end
end
