defmodule Mywallet.Budget do
  use Mywallet.Web, :model

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
    |> validate_required([:currency, :month, :year, :amount, :created_by, :updated_by])
  end
end
