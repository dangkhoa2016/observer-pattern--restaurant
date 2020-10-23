class Chef {
  static template = null;
  #holder = null;
  #element = null;
  static #id_increase = 0;
  #current_order = null;
  #progress = [];
  #timeout_unhighlight = null;

  // each instance of the Observer class
  // starts with an empty array of things (observers)
  // that react to a state change
  #observer_assistants = [];

  constructor(name, holder) {
    Chef.#id_increase += 1;
    this.id = Chef.#id_increase;
    this.status = 1;
    if (holder) this.#holder = $(holder);

    if (Chef.template) {
      var chef = $(Chef.template({ name }));
      this.#element = chef;

      chef.appendTo(this.#holder);
      this.#init();
    }
  }

  process_order(order) {
    var t = this;
    if (t.#current_order && t.#current_order.status === 1) {
      return false;
    }

    //this.#hight_light_test(true);

    this.#update_status(2);
    order.status = 2;
    t.#current_order = order;

    var time_to_complete = Math.floor(Math.random() * 30);
    t.#progress.push(
      new Progress({
        html: `<span class="badge badge-primary">Chef: ${t.id}</span> is processing <strong>${order.food.name}</strong>`,
        holder: t.#element.find(".cook-progress"),
        time_to_complete,
        call_back_complete: function(progress) {
          t.complete_order();
          var indx_pg = t.#progress.indexOf(progress);
          if (indx_pg !== -1) t.#progress.splice(indx_pg, 1);
          progress.destroy();
        }
      })
    );
  }

  complete_order() {
    this.#current_order.status = 3;
    this.#update_status(1);
    this.#hight_light_test();
    this.notify(this.id, this.#current_order);
  }

  #update_status(status) {
    this.status = status;
    this.#set_bg_process(status === 1);
  }

  #set_bg_process(complete) {
    if (complete) this.#element.removeClass("processing");
    else this.#element.addClass("processing");
  }

  #hight_light_test(unhighlight = false) {
    var t = this;
    if (unhighlight) {
      t.#element.removeClass("hight-light");
      t.#clear_timeout();
    }
    t.#element.addClass("hight-light");
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

  #init() {
    var t = this;
  }

  // add the ability to subscribe to a new object / DOM element
  // essentially, add something to the observers array
  subscribe(fn_to_call) {
    this.#observer_assistants.push(fn_to_call);
  }

  // add the ability to unsubscribe from a particular object
  //// essentially, remove something from the observers array
  unsubscribe(fn_to_remote) {
    this.#observer_assistants = this.#observer_assistants.filter(
      subscriber => subscriber !== fn_to_remote
    );
  }

  // update all subscribed objects / DOM elements
  // and pass some data to each of them
  notify(id, data) {
    this.#observer_assistants.forEach(observer => observer(id, data));
  }
}
