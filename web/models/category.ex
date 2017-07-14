defmodule Mywallet.Category do
  use Mywallet.Web, :model

  @derive {Poison.Encoder, only: [:id, :name]}
  schema "categories" do
    field :name, :string
    field :note, :string
    field :user_id, :integer
    field :inserted_by, :integer
    field :updated_by, :integer

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :note, :user_id, :inserted_by, :updated_by])
    |> validate_required([:name, :note, :user_id, :inserted_by, :updated_by])
  end
end
