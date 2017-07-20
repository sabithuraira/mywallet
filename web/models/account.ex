defmodule Mywallet.Account do
  use Mywallet.Web, :model

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
end
