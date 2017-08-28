defmodule Mywallet.Budget do
  use Mywallet.Web, :model

  require Logger

  alias Ecto.Adapters.SQL
  alias Mywallet.Repo

  schema "budgets" do
    field :currency, :string
    field :month, :integer
    field :year, :integer
    field :amount, :decimal
    field :account, :integer
    # field :category, :integer
    field :note, :string
    field :created_by, :integer
    field :updated_by, :integer
    timestamps()

    belongs_to :category_rel, Mywallet.Category, foreign_key: :category
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:currency, :month, :year, :category, :amount, :note, :created_by, :updated_by])
    |> validate_required([:currency, :month, :year, :category, :amount, :created_by, :updated_by])
  end

  def list_budget(id) do
    sql_str = "SELECT b.*, COALESCE(SUM(w.amount),0) as detail_total, (b.amount - COALESCE(SUM(w.amount),0)) as detail_diff, c.name   
                FROM budgets b 
                JOIN categories c ON c.id=b.category
                LEFT JOIN wallets w ON w.category=b.category 
                AND b.created_by=w.inserted_by 
                AND b.month=Extract(month from w.date)
                AND b.year=Extract(year from w.date) 
                WHERE b.created_by="<>id<>" 
                GROUP BY b.id, c.id
                ORDER BY b.year DESC, b.month DESC";
    
    result = SQL.query(Repo, sql_str,[])
    list = []
    
    case result do
      {:ok, columns} ->
        list = for item <- columns.rows do
            %{
              id: Enum.at(item,0),
              currency: Enum.at(item,1),
              month: Enum.at(item,2),
              year: Enum.at(item,3),
              amount: Enum.at(item,4),
              account: Enum.at(item,5),
              note: Enum.at(item,6),
              created_by: Enum.at(item,7),
              updated_by: Enum.at(item,8),
              inserted_at: Enum.at(item,9),
              updated_at: Enum.at(item,10),
              category: Enum.at(item,11),
              detail_total: Enum.at(item,12),
              detail_diff: Enum.at(item,13),
              category_label: Enum.at(item,14)
            }
        end
      _ -> IO.puts("error")
    end
  end

  def resume(%{"id"=>id, "month"=>month,"year"=>year}) do
    sql_str = "SELECT COALESCE(SUM(b.amount),0) as budget_total, 
				        (
                    SELECT COALESCE(SUM(w.amount),0) FROM wallets AS w WHERE 
                	    b.created_by=w.inserted_by 
                      AND b.month=Extract(month from w.date)
                      AND b.year=Extract(year from w.date)
                ) as trans_total 
                FROM budgets AS b 
                WHERE b.month="<>month<>" AND b.year="<>year<>" AND b.created_by="<>id<>" 
                GROUP BY b.created_by, b.month, b.year";
    
    result = SQL.query(Repo, sql_str,[])
    
    case result do
      {:ok, columns} ->
        item = Enum.at(columns.rows,0)

        %{
            total_budget: Enum.at(item,0),
            total_pay: Enum.at(item,1)
        }
      _ -> IO.puts("error")
    end
  end


end
