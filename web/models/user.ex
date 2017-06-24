defmodule Mywallet.User do
  use Mywallet.Web, :model

  alias Mywallet.Repo
  import Comeonin.Bcrypt, only: [hashpwsalt: 1]

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
    |> validate_required([:email, :encrypt_password])
    |> validate_format(:email, ~r/@/, message: "Please fix your email format")
    |> validate_confirmation(:encrypt_password)
  end

  def generate_password_and_store_user(changeset) do
    put_change(changeset, :encrypt_password, hashpwsalt(changeset.params["encrypt_password"]))
      |> Repo.insert
  end
end
