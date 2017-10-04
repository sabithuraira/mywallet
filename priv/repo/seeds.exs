# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Mywallet.Repo.insert!(%Mywallet.SomeModel{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias Mywallet.Repo
alias Mywallet.Category
alias Mywallet.Currency

Repo.insert!(%Category{
    name: "Food",
    note: "",
    user_id: 0,
    inserted_by: 1,
    updated_by: 1
})


Repo.insert!(%Category{
    name: "Utilities",
    note: "",
    user_id: 0,
    inserted_by: 1,
    updated_by: 1
})


Repo.insert!(%Category{
    name: "Medical",
    note: "",
    user_id: 0,
    inserted_by: 1,
    updated_by: 1
})


Repo.insert!(%Category{
    name: "Home/rent",
    note: "",
    user_id: 0,
    inserted_by: 1,
    updated_by: 1
})


Repo.insert!(%Currency{
    name: "IDR",
    note: "Indonesia",
    inserted_by: 1,
    updated_by: 1
})


Repo.insert!(%Currency{
    name: "USD",
    note: "US Dollar",
    inserted_by: 1,
    updated_by: 1
})


Repo.insert!(%Currency{
    name: "SGD",
    note: "Singapore Dollar",
    inserted_by: 1,
    updated_by: 1
})


Repo.insert!(%Currency{
    name: "JPY",
    note: "Japan",
    inserted_by: 1,
    updated_by: 1
})