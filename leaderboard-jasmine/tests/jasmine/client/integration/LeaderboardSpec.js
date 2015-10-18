var selectGraceHopper = function (callback) {
  Session.set("selected_player", Players.findOne({name: "Grace Hopper"})._id);
  if (callback) {
    Deps.afterFlush(callback);
  }
};

var unselectPlayer = function () {
  Session.set("selected_player", null);
};

describe("Selecting Grace Hopper", function () {
  beforeEach(function (done) {
    Meteor.autorun(function (c) {
      var grace = Players.findOne({name: "Grace Hopper"});
      if (grace) {
        c.stop();
        selectGraceHopper(done);
      }
    })
  });

  it("should show Grace above the give points button", function () {
    expect($("div.details > div.name").html()).toEqual("Grace Hopper");
  });


  it("should highlight Grace's name", function () {
    var parentDiv = $("span.name:contains(Grace Hopper)").parent();
    expect(parentDiv.hasClass("selected")).toBe(true);
  });
});

describe("Point Assignment", function () {
  beforeEach(function (done) {
    selectGraceHopper(done);
  });

  it("should give a player 5 points when he is selected and the button is pressed", function () {
    var graceInitialPoints = Players.findOne({name: "Grace Hopper"}).score;
    $("input:button.inc").click();
    expect(Players.findOne({name: "Grace Hopper"}).score).toBe(graceInitialPoints + 5);
  });
  it("should remove a player 5 points when he is selected and the button is pressed", function () {
    var graceInitialPoints = Players.findOne({name: "Grace Hopper"}).score;
    $("input:button.dec").click();
    expect(Players.findOne({name: "Grace Hopper"}).score).toBe(graceInitialPoints -5);
  });
});

describe("Player Ordering", function () {
  it("should result in a list where the first player has as many or more points than the second player", function () {
    var players = PlayersService.getPlayerList().fetch();
    expect(players[0].score >= players[1].score).toBe(true);
  });
});


describe("Player removed", function (){
  it("should return undefined for player  in the list", function (){
    var graceRemoveSelected = Players.findOne({name: "Grace Hopper"});
    $("input:button.remove").click();
    expect(Players.findOne(graceRemoveSelected)).toBeUndefined();
  });
});

describe("Player added", function(){
  it("should return the new count of List bigger tha old count", function (){
    var countList = Players.find().count();
    console.log(countList);
    $("form input").click();
    console.log(Players.find().fetch());
    expect(Players.find().count()).toBe(countList + 1);

  })
})
