class Assistant {
  static template = null;
  static template_receive = null;

  #chefs = [];
  #orders = [];
  #timeout_to_send = 3;
  #holder = null;
  #element = null;
  #timeout_unhighlight = null;

  // each instance of the Observer class
  // starts with an empty array of things (observers)
  // that react to a state change
  #observer_tables = [];

  constructor(chefs, holder) {
    //console.log('Assistant', chefs);
    var t = this;
    t.#holder = holder;
    t.#render();
    if (chefs) {
      t.#chefs = chefs;
      $.each(chefs, function(indx, chef) {
        chef.subscribe(function(chef_id, order) {
          t.#chef_done(chef_id, order);
        });
      });
    }
  }

  add_orders(orders) {
    this.#orders = this.#orders.concat(orders || []);
    this.#send_to_chefs();
    console.log("Receive orders", orders, "total", this.#orders.length);
  }

  #add_info(chef_id, order) {
    var info = $(
      Assistant.template_receive({ chef_id, order, date: new Date() })
    );
    this.#element.find(".card-footer").append(info);
    setTimeout(function() {
      info.remove();
    }, 8000);
  }

  #assign_job(chef_id) {
    var t = this;
    if (t.#orders.length > 0) {
      setTimeout(function() {
        $.each(t.#chefs, function(idx, chef) {
          if (chef.id === chef_id) {
            $.each(t.#orders, function(indxo, orderx) {
              if (orderx.status === 1) {
                t.#send_to_chef(chef, orderx);
                return false;
              }
            });
            return false;
          }
        });
      }, t.#timeout_to_send * 1000);
    } else {
      console.log("No orders.");
    }
  }

  #chef_done(chef_id, order) {
    var t = this;
    t.#add_info(chef_id, order);

    t.#hight_light_test();
    t.notify(order);

    var indx = t.#orders.indexOf(order);
    t.#orders.splice(indx, 1);
    console.log("remain: ", t.#orders);
    t.#assign_job(chef_id);
  }

  #hight_light_test(unhighlight = false) {
    var t = this;
    if (unhighlight) {
      t.#element.removeClass("hight-light");
      t.#clear_timeout();
    }
    t.#element.addClass("hight-light");
    if (t.#timeout_unhighlight) clearTimeout(t.#timeout_unhighlight);

    t.#timeout_unhighlight = setTimeout(function() {
      t.#element.removeClass("hight-light");
    }, 2000);
  }

  #clear_timeout() {
    var t = this;
    if (t.#timeout_unhighlight) {
      clearTimeout(t.#timeout_unhighlight);
      t.#timeout_unhighlight = null;
    }
  }

  #send_to_chef(chef, order) {
    if (chef && order) {
      if (chef.status === 1) chef.process_order(order);
      //else console.log(`Chef [${chef.id}] is busy.`);
    }
  }

  #send_to_chefs() {
    var t = this;
    if (t.#orders.length > 0) {
      setTimeout(function() {
        for (var i = 0; i < t.#chefs.length; i++) {
          if (t.#orders.length > i) t.#send_to_chef(t.#chefs[i], t.#orders[i]);
          else break;
        }
      }, t.#timeout_to_send * 1000);
    }
  }

  #render() {
    if (Assistant.template) {
      var assistant = $(Assistant.template({ name }));
      this.#element = assistant;
      assistant.appendTo(this.#holder);
    }
  }

  // add the ability to subscribe to a new object / DOM element
  // essentially, add something to the observers array
  subscribe(fn_to_call) {
    this.#observer_tables.push(fn_to_call);
  }

  // add the ability to unsubscribe from a particular object
  // essentially, remove something from the observers array
  unsubscribe(fn_to_remote) {
    this.#observer_tables = this.#observer_tables.filter(
      subscriber => subscriber !== fn_to_remote
    );
    // console.log('this.#observer_tables', this.#observer_tables.length);
  }

  // update all subscribed objects / DOM elements
  // and pass some data to each of them
  notify(data) {
    this.#observer_tables.forEach(observer => observer(data));
  }
}
