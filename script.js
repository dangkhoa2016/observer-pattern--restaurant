$(function() {
  Helper.shuffle();

  var restaurant = new Restaurant({
    chef_holder: "#chef-holder",
    table_holder: "#table-holder",
    number_test_tables: 2
  });

  console.log(restaurant);
});
