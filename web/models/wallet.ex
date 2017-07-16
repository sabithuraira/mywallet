defmodule Mywallet.Wallet do
  use Mywallet.Web, :model

  schema "wallets" do
    field :note, :string
    field :currrrency, :string
    field :amount, :decimal
    field :date, Ecto.Date
    field :account, :integer
    field :category, :integer
    field :type, :integer
    field :inserted_by, :integer
    field :updated_by, :integer

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:note, :currrrency, :amount, :date, :account, :category, :type, :inserted_by, :updated_by])
    |> validate_required([:note, :currrrency, :amount, :date, :account, :category, :type, :inserted_by, :updated_by])
  end
end
