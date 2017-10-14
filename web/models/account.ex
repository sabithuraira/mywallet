defmodule Mywallet.Account do
  use Mywallet.Web, :model

  alias Mywallet.Repo
  alias Mywallet.Account

  schema "accounts" do
    field :name, :string
    field :note, :string
    field :created_by, :integer
    field :updated_by, :integer

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :note, :created_by, :updated_by])
    |> validate_required([:name, :note, :created_by, :updated_by])
  end

  def create_account_if_empty(id) do
    # get all account data from current user
    result = Repo.all(from a in Account, select: count(a.id), where: a.created_by == ^id)

    # check if data exist
    case Enum.at(result,0) do
      0 -> 
        Repo.insert!(%Account{
            name: "Cash Money",
            note: "Account for cash money",
            created_by: id,
            updated_by: id
        })
      _ -> IO.puts "nope"
    end
  end

end
