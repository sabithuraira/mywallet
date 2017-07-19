defmodule Mywallet.Billing do
  use Mywallet.Web, :model

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
end
