$(document).ready(function () {
  /** Create Category */
  $("#create-category-button").on("click", function (e) {
    e.preventDefault();
    var title = $("#category-title").val();
    $.ajax({
      url: "/admin/categories/create",
      type: "POST",
      data: { title },
      success: function (response) {
        var html = `<tr>
                <td>${response.title}</td>
                <td class="d-flex justify-content-center">
                    <a href="/admin/category/edit/${response._id}" class="btn btn-sm btn-warning mr-2">Edit</a>
                    <form action="/admin/category/${response._id}?newMethod=DELETE" method="post">
                        <button class="btn btn-sm btn-danger" type="submit">Delete</button>
                    </form>
                </td>
            </tr>`;
        $(".category-list").append(html);
      },
    });
    $("#category-title").val("");
  });

  /** Update Category */
  $("#update-category-button").on("click", function (e) {
    e.preventDefault();
    var title = $("#category-title").val();
    var id = $("#category-id").val();
    $.ajax({
      url: `/admin/category/edit/${id}`,
      type: "POST",
      data: { title },
      success: function (response) {
        window.location.href = response.url;
      },
    });
  });
});
