class Table {
  static template = null;
  static template_foods = null;

  #element = null;
  #holder = null;
  #food_list = null;
  static #id_increase = 0;
  #orders = [];
  #timeout_unhighlight = null;
  #progress = [];
  #fn_help = null;

  constructor(options = {}) {
    this.#holder = options.holder;
    Table.#id_increase += 1;
    this.id = Table.#id_increase;

    this.#food_list = options.food_list;
    this.#fn_help = options.fn_help;

    this.render();
    this.#init_table();
  }

  render() {
    if (Table.template) {
      var table = $(Table.template({ name: this.id }));

      if (this.#holder) {
        var pos = -1;
        var has_recent_created = this.#holder.find(".draggable:last");
        if (has_recent_created.length > 0)
          pos = parseFloat(has_recent_created.css("left")) + 20;
        if (pos !== -1) table.css("left", pos + "px");

        table.appendTo(this.#holder);
        table.tooltip({ trigger: "manual" });
      }

      this.#element = table;
    }
  }

  destroy() {
    if (this.#fn_help) this.#fn_help(null, false);
    $('[data-toggle="tooltip"]', this.#element).tooltip("dispose");
    this.#element.tooltip("dispose");
    this.#element.remove();
    this.#element = null;
  }

  #init_table() {
    this.#bind_click();
    new Draggabilly(this.#element[0], { handle: ".card-header" });
    $('[data-toggle="tooltip"]', this.#element).tooltip();
  }

  add_orders(orders) {
    this.#orders = this.#orders.concat(orders || []);
    this.#render_foods(orders);
  }

  #render_foods(orders) {
    if (orders && orders.length > 0) {
      this.#element.find(".food-list").append(Table.template_foods({ orders }));
    }
  }

  #bind_click() {
    var t = this;
    t.#element.find(".btn-add-foods").click(function(e) {
      e.preventDefault();

      t.#food_list.show_menu_for(t);
    });

    t.#element.find(".btn-remove").click(function(e) {
      e.preventDefault();
      if (t.#fn_help) t.#fn_help("remove", t);
    });

    var btnunsubscribe = t.#element.find(".btn-unsubscribe");
    var btnsubscribe = t.#element.find(".btn-subscribe");

    var toggle_subscribe = function(subscribe) {
      if (t.#fn_help) t.#fn_help(null, subscribe);
      if (subscribe) {
        btnsubscribe.addClass("d-none");
        btnunsubscribe.removeClass("d-none");
      } else {
        btnsubscribe.removeClass("d-none");
        btnunsubscribe.addClass("d-none");
      }
    };

    btnunsubscribe.click(function(e) {
      e.preventDefault();
      toggle_subscribe(false);
    });
    btnsubscribe.click(function(e) {
      e.preventDefault();
      toggle_subscribe(true);
    });
  }

  #remove_order(order) {
    var indx = this.#get_order_index(order);
    if (indx !== -1 && this.#element) {
      var ord = this.#element.find(`.food-list .order${order.id}`);
      if (ord.length > 0) {
        ord.remove();
        this.#orders.splice(indx, 1);
      }
    }
  }

  #get_order_index(order) {
    var result = -1;
    $.each(this.#orders, function(indx, ord) {
      if (ord.id === order.id) {
        result = indx;
        return false;
      }
    });
    return result;
  }

  receive_food(order) {
    var t = this;

    t.#hight_light_test();

    var indx = t.#get_order_index(order);
    if (indx !== -1) {
      var time_to_complete = Math.floor(Math.random() * 30);
      t.#progress.push(
        new Progress({
          icon: "fas fa-check-double",
          html: `<span class="badge badge-warning">Table: ${t.id}</span> is eating <strong>${order.food.name}</strong>`,
          holder: t.#element.find(`.order${order.id} .eat-progress`),
          time_to_complete,
          reference: order,
          call_back_complete: function(progress, ord) {
            var indx_pg = t.#progress.indexOf(progress);
            if (indx_pg !== -1) t.#progress.splice(indx_pg, 1);
            t.#remove_order(ord);
            progress.destroy();
          }
        })
      );
    }
  }

  #hight_light_test(unhighlight = false) {
    var t = this;
    if (unhighlight) {
      t.#element.removeClass("hight-light").tooltip("hide");
      t.#clear_timeout();
    }

    t.#element
      .addClass("hight-light")
      .attr("data-original-title", "Receive info from Assistant")
      .tooltip("show");
    if (t.#timeout_unhighlight) clearTimeout(t.#timeout_unhighlight);

    t.#timeout_unhighlight = setTimeout(function() {
      t.#element.removeClass("hight-light").tooltip("hide");
    }, 3000);
  }

  #clear_timeout() {
    var t = this;
    if (t.#timeout_unhighlight) {
      clearTimeout(t.#timeout_unhighlight);
      t.#timeout_unhighlight = null;
    }
  }
}
