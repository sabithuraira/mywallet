defmodule Mywallet.User do
  use Mywallet.Web, :model

  schema "users" do
    field :name, :string
    field :email, :string
    field :encrypt_password, :string
    field :avatar, :string
    field :last_login, Ecto.DateTime

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :email, :encrypt_password, :avatar, :last_login])
    |> validate_required([:name, :email, :encrypt_password, :avatar, :last_login])
  end
end
