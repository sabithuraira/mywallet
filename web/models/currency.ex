defmodule Mywallet.Currency do
  use Mywallet.Web, :model

  schema "currencies" do
    field :name, :string
    field :note, :string
    field :inserted_by, :integer
    field :updated_by, :integer

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :note, :inserted_by, :updated_by])
    |> validate_required([:name, :note, :inserted_by, :updated_by])
  end
end
