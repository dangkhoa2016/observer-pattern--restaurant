class Restaurant {
  #number_chefs = 2;
  #number_test_tables = 0;
  #table_holder = null;
  #chef_holder = null;
  #assistant = null;
  #panel_action = null;

  constructor(options = {}) {
    var holder = options.holder;
    if (options.table_holder) this.#table_holder = $(options.table_holder);
    this.#chef_holder = options.chef_holder;
    this.#number_test_tables = options.number_test_tables || 0;
    var root = $(holder ? holder : "body");

    this.#panel_action = new PanelAction(this);
    this.init();
  }

  init() {
    var t = this;

    new Template(function() {
      for (var i = 0; i < t.#number_chefs; i++) {
        t.chefs.push(new Chef(i + 1, t.#chef_holder));
      }

      t.#assistant = new Assistant(t.chefs, "#assistant");

      t.#init_food_list();
      if (
        typeof t.#number_test_tables === "number" &&
        t.#number_test_tables > 0
      ) {
        for (var i = 0; i < t.#number_test_tables; i++) t.add_table();
      }
    });

    this.chefs = [];
    this.food_list = null;
    this.tables = [];
  }

  remove_table(table) {
    var indx = this.tables.indexOf(table);
    this.tables.splice(indx, 1);
  }

  add_table() {
    var t = this;
    var fn_subscribe = function(data) {
      tb.receive_food(data);
    };
    var fn_help = function(type, value) {
      if (type === "remove") {
        t.#panel_action.show_confirm(
          "Are you sure to remove this table ?",
          function() {
            t.remove_table(value);
            value.destroy();
          }
        );
        return;
      }

      // console.log('fn_help', tb, value);
      if (value) t.#assistant.subscribe(fn_subscribe);
      else t.#assistant.unsubscribe(fn_subscribe);
    };
    var tb = new Table({
      holder: t.#table_holder,
      food_list: this.food_list,
      fn_help
    });

    t.#assistant.subscribe(fn_subscribe);
    t.tables.push(tb);
  }

  #init_food_list() {
    var t = this;
    t.food_list = new FoodList();
    t.food_list.subscribe(function(data) {
      t.#assistant.add_orders(data);
    });
    t.food_list.render();
  }
}
