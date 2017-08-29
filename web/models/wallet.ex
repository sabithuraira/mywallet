defmodule Mywallet.Wallet do
  use Mywallet.Web, :model
  alias Ecto.Adapters.SQL
  alias Mywallet.Repo

  schema "wallets" do
    field :note, :string
    field :currency, :string
    field :amount, :decimal
    field :date, Ecto.Date
    # field :account, :integer
    field :type, :integer
    field :inserted_by, :integer
    field :updated_by, :integer
    field :billing_id, :integer

    timestamps()

    belongs_to :category_rel, Mywallet.Category, foreign_key: :category
    belongs_to :account_rel, Mywallet.Account, foreign_key: :account
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:note, :currency, :amount, :date, :account, :category, :type, :inserted_by, :updated_by, :billing_id])
    |> validate_required([:note, :currency, :amount, :date, :account, :category, :type, :inserted_by, :updated_by])
  end

  def resume(%{"id"=>id, "month"=>month,"year"=>year}) do
    sql_str = "SELECT COALESCE(SUM(amount),0) as total, 
            COALESCE(SUM(CASE WHEN type=2 THEN amount ELSE 0 END),0) as total_expense,
            COALESCE(SUM(CASE WHEN type=1 THEN amount ELSE 0 END),0) as total_income
            FROM wallets AS w WHERE
            Extract(month from w.date)="<>month<>" AND
            Extract(year from w.date)="<>year<>" AND
            w.inserted_by="<>id;
    
    result = SQL.query(Repo, sql_str,[])
    
    case result do
      {:ok, columns} ->
        item = Enum.at(columns.rows,0)

        %{
            total: Enum.at(item,0),
            total_expense: Enum.at(item,1),
            total_income: Enum.at(item,2)
        }
      _ -> IO.puts("error")
    end
  end

end
