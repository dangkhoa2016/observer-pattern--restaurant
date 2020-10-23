class FoodList {
  #root = null;
  #current_table = null;
  #list = null;

  // each instance of the Observer class
  // starts with an empty array of things (observers)
  // that react to a state change
  #observer_assistants = [];

  constructor() {
    var root = $("#modal-holder");
    if (root.length === 0) root = $("body");
    this.#root = root;

    this.foods = [];
  }

  show_menu_for(table) {
    this.#current_table = table;

    $.each(this.foods, function(indx, food) {
      food.set_state(false);
    });

    this.#list.modal({ show: true, backdrop: "static" });
  }

  #bind_click() {
    var t = this;
    $(".btn-order", t.#list).click(function(e) {
      e.preventDefault();

      var orders = t.#create_orders();
      if (orders.length > 0) {
        t.#current_table.add_orders(orders);
        t.notify(orders);
        $(".modal-footer label", t.#list).text("");
        t.#list.modal("hide");
      } else $(".modal-footer label", t.#list).text("Please select at least one food !");
    });
  }

  #create_orders() {
    var selected = [];
    var t = this;
    $.each(this.foods, function(indx, food) {
      if (food.is_selected()) selected.push(new Order(t.#current_table.id, food));
    });
    return selected;
  }

  render() {
    var t = this;
    if (t.#list === null || t.#list.length === 0) {
      $.get("/parts/modal-foods.html", function(res) {
        t.#list = $(res);
        $.get("/data/data.json", function(data) {
          $.each(data, function(indx, obj) {
            var food = new Food(t.#list.find("#food-list"), obj);
            t.foods.push(food);
            food.render();
          });

          t.#root.append(t.#list);

          t.#bind_click();
        });
      });
    }
  }

  // add the ability to subscribe to a new object / DOM element
  // essentially, add something to the observers array
  subscribe(fn_to_call) {
    this.#observer_assistants.push(fn_to_call);
  }

  // add the ability to unsubscribe from a particular object
  // essentially, remove something from the observers array
  unsubscribe(fn_to_remote) {
    this.#observer_assistants = this.#observer_assistants.filter(
      subscriber => subscriber !== fn_to_remote
    );
  }

  // update all subscribed objects / DOM elements
  // and pass some data to each of them
  notify(data) {
    this.#observer_assistants.forEach(observer => observer(data));
  }
}
