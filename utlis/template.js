class Template {
  constructor(cb) {
    if (
      Food.template === null ||
      Table.template === null ||
      Chef.template === null
    ) {
      $.get("/template/template.html", function(res) {
        var coll = $(res);

        Food.template = Handlebars.compile(coll.filter("#tmp-food").html());
        Table.template = Handlebars.compile(coll.filter("#tmp-table").html());
        Table.template_foods = Handlebars.compile(coll.filter("#tmp-food-list").html());
        Chef.template = Handlebars.compile(coll.filter("#tmp-chef").html());
        Assistant.template = Handlebars.compile(coll.filter("#tmp-assistant").html());
        Assistant.template_receive = Handlebars.compile(coll.filter("#tmp-assistant-receive").html());
        Progress.template_pg = Handlebars.compile(coll.filter("#tmp-progress").html());
        Progress.template_pg_bar = Handlebars.compile(coll.filter("#tmp-progress-bar").html());

        if (typeof cb === "function") cb();
      });
    }
  }
}
