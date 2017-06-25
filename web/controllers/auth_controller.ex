defmodule Mywallet.AuthController do
    use Mywallet.Web, :controller

    alias Mywallet.User

    plug Ueberauth

    def register(conn, _params) do
        changeset = User.changeset(%User{})

        render conn, "register.html", 
            layout: {Mywallet.LayoutView, "login.html"},
            changeset: changeset
    end

    def save(conn, %{"user" => user_params}) do
        changeset = User.changeset(%User{}, user_params)

        if changeset.valid? do
        new_user = User.generate_password_and_store_user(changeset)

        user = Repo.get_by(User, email: String.downcase(changeset.params["email"]))
        conn
            |> Guardian.Plug.sign_in(user)
            # |> put_session(:current_user, user.id)
            |> redirect(to: page_path(conn, :index))
        else
        render conn, "register.html", 
            layout: {Mywallet.LayoutView, "login.html"},
            changeset: changeset
        end
    end

    def login(conn, _params) do
        render conn, "login.html",
        layout: {Mywallet.LayoutView, "login.html"}
    end

    def authenticate(conn, %{"user" => user_params}) do
        case Mywallet.Auth.login(user_params, Mywallet.Repo) do
        {:ok, user} ->
            conn
            |> Guardian.Plug.sign_in(user)
            |> put_flash(:info, "Berhasil Login. Bagikan momen menarik pekerjaan anda! Masukkan foto anda pada FotoKerja")
            |> redirect(to: "/")
        :error ->
            conn
            |> put_flash(:info, "Wrong email or password")
            |> render "login.html", layout: {Mywallet.LayoutView, "login.html"}
        end
    end

    def logout(conn, _) do
        Guardian.Plug.sign_out(conn)
        |> put_flash(:info, "Logged out")
        |> redirect(to: "/")
    end

    def callback(%{assigns: %{ueberauth_failure: _fails}} = conn, _params) do
        conn
        |> put_flash(:error, "Failed to authenticate.")
        |> redirect(to: "/")
    end

    def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
        case Mywallet.Auth.find_or_create(auth) do
        {:ok, user} ->
            conn
            |> put_flash(:info, "Successfully authenticated.")
            |> Guardian.Plug.sign_in(user)
            |> redirect(to: "/")
        {:error, reason} ->
            conn
            |> put_flash(:error, reason)
            |> redirect(to: "/")
        end
    end
end
