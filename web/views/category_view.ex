defmodule Mywallet.CategoryView do
  use Mywallet.Web, :view

  def render("index.json", %{categories: categories}) do
    %{data: render_many(categories, Mywallet.CategoryView, "category.json")}
  end

  def render("show.json", %{category: category}) do
    %{data: render_one(category, Mywallet.CategoryView, "category.json")}
  end

  def render("category.json", %{category: category}) do
    %{id: category.id,
      name: category.name,
      note: category.note,
      user_id: category.user_id,
      inserted_by: category.inserted_by,
      updated_by: category.updated_by}
  end
end
