class PanelAction {
  #panel_action = $("#panel-action");
  #restaurant = null;
  #confirm = null;
  #confirm_text = "Are you sure ?";
  #call_back = null;
  #root = null;

  constructor(restaurant) {
    this.#restaurant = restaurant;
    var root = $("#modal-holder");
    if (root.length === 0) root = $("body");
    this.#root = root;

    this.render();
  }

  render() {
    var t = this;
    this.#bind_click();

    $.get("/parts/modal-confirm.html", function(res) {
      t.#confirm = $(res);

      t.#confirm.find(".btn-sure").click(function(e) {
        e.preventDefault();
        if (t.#call_back) t.#call_back();
        t.#confirm.modal("hide");
      });

      t.#root.append(t.#confirm);
    });

    this.init_add_table();
  }

  show_confirm(msg, cb) {
    var t = this;

    if (typeof cb === "function") t.#call_back = cb;
    msg = msg || t.#confirm_text;
    t.#confirm
      .find(".modal-body")
      .html(msg)
      .end()
      .modal("show");
  }

  init_add_table() {
    var t = this;
    $(".btn-add-table", t.#panel_action).click(function(e) {
      e.preventDefault();

      t.#restaurant.add_table();
    });
  }

  #bind_click() {
    var t = this;
    var pa = t.#panel_action;
    $(".btn-action-main", pa).click(function(e) {
      e.preventDefault();

      var left = 10;
      var isHide = pa.hasClass("hide-panel");
      if (isHide === false) {
        var wp = pa.outerWidth();
        left = -wp;
      }

      pa.stop().animate({ left: left }, function() {
        if (isHide) pa.removeClass("hide-panel");
        else pa.addClass("hide-panel");
      });
    });
  }
}
