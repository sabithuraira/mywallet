defmodule Mywallet.Auth do
  alias Mywallet.User
  alias Mywallet.Repo
  alias Ueberauth.Auth

  def login(params, repo) do
    user = repo.get_by(User, email: String.downcase(params["email"]))
    case authenticate(user, params["password"]) do
      true -> {:ok, user}
      _    -> :error
    end
  end

  defp authenticate(user, password) do
    case user do
      nil -> false
      _   -> Comeonin.Bcrypt.checkpw(password, user.encrypt_password)
    end
  end

  def current_user(conn) do
    user =  Guardian.Plug.current_resource(conn)
    if user, do: Mywallet.Repo.get(User, user.id)
  end

  def logged_in?(conn), do: !!current_user(conn)

  def find_or_create(%Auth{provider: :identity} = auth) do
    case validate_pass(auth.credentials) do
      :ok ->
        {:ok, basic_info(auth)}
      {:error, reason} -> {:error, reason}
    end
  end

  def find_or_create(%Auth{} = auth) do
    {:ok, basic_info(auth)}
  end

  defp basic_info(auth) do
    name = name_from_auth(auth)
    email = case auth.info.email do
      nil -> String.downcase(String.replace(name," ","") <> "@facebook.com")
      _ -> auth.info.email
    end

    
    user = case Mywallet.Repo.get_by(User, email: String.downcase(email)) do
      nil -> 
        Repo.insert! %User{
          name: name_from_auth(auth),
          encrypt_password: auth.uid,
          email: email,
        }
      _ -> 
        Mywallet.Repo.get_by(User, email: String.downcase(email))
    end

    # %{id: auth.uid, name: name_from_auth(auth), email: auth.info.email, username: auth.info.email}
  end

  defp name_from_auth(auth) do
    if auth.info.name do
      auth.info.name
    else
      name = [auth.info.first_name, auth.info.last_name]
      |> Enum.filter(&(&1 != nil and &1 != ""))

      cond do
        length(name) == 0 -> auth.info.nickname
        true -> Enum.join(name, " ")
      end
    end
  end

  defp validate_pass(%{other: %{password: ""}}) do
    {:error, "Password required"}
  end

  defp validate_pass(%{other: %{password: pw, password_confirmation: pw}}) do
    :ok
  end

  defp validate_pass(%{other: %{password: _}}) do
    {:error, "Passwords do not match"}
  end

  defp validate_pass(_), do: {:error, "Password Required"}
end
