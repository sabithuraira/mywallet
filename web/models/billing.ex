defmodule Mywallet.Billing do
  use Mywallet.Web, :model
  alias Ecto.Adapters.SQL
  alias Mywallet.Repo
  require Logger

  schema "billings" do
    field :note, :string
    # field :category, :integer
    field :amount, :decimal
    field :currency, :string
    field :date, Ecto.Date
    field :inserted_by, :integer
    field :updated_by, :integer

    timestamps()
    belongs_to :category_rel, Mywallet.Category, foreign_key: :category
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:note, :category, :amount, :currency, :date, :inserted_by, :updated_by])
    |> validate_required([:note, :category, :amount, :currency, :date, :inserted_by, :updated_by])
  end

  def list_billing(id) do
    sql_str ="SELECT b.*, COALESCE(SUM(w.amount),0) as paying, (b.amount - COALESCE(SUM(w.amount),0)) as residual, c.name   
                FROM billings b 
                JOIN categories c ON c.id=b.category
                LEFT JOIN wallets w ON w.billing_id=b.id 
                WHERE b.inserted_by="<>id<>" 
                GROUP BY b.id, c.id
                ORDER BY b.date DESC";

    result = SQL.query(Repo, sql_str,[])
    Logger.info inspect(result)
    list = []
    
    case result do
      {:ok, columns} ->
        list = for item <- columns.rows do
            %{
              id: Enum.at(item,0),
              note: Enum.at(item,1),
              category: Enum.at(item,2),
              amount: Enum.at(item,3),
              currency: Enum.at(item,4),
              date: Enum.at(item,5),
              inserted_by: Enum.at(item,6),
              updated_by: Enum.at(item,7),
              inserted_at: Enum.at(item,8),
              updated_at: Enum.at(item,9),
              paying: Enum.at(item,10),
              residual: Enum.at(item,11),
              category_label: Enum.at(item,12)
            }
        end
      _ -> IO.puts("error")
    end
  end

def resume(%{"id"=>id, "month"=>month,"year"=>year}) do
    sql_str = "SELECT COALESCE(SUM(billing_total),0) as bil_total, COALESCE(SUM(trans_total),0) as trans_total
                FROM(
                  SELECT COALESCE(SUM(b.amount),0) as billing_total, 
                          (
                              SELECT COALESCE(SUM(w.amount),0) FROM wallets AS w WHERE b.id=w.billing_id 
                          ) as trans_total 
                          FROM billings AS b 
                          WHERE Extract(month from b.date)="<>month<>" AND 
                          Extract(year from b.date)="<>year<>" AND b.inserted_by="<>id<>" 
                          GROUP BY b.inserted_by, b.id
                      ) as per_row";
    
    result = SQL.query(Repo, sql_str,[])
    
    case result do
      {:ok, columns} ->
        item = Enum.at(columns.rows,0)

        %{
            total_billing: Enum.at(item,0),
            total_pay: Enum.at(item,1)
        }
      _ -> IO.puts("error")
    end
  end


end
