defmodule Mywallet.Wallet do
  use Mywallet.Web, :model

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
end
