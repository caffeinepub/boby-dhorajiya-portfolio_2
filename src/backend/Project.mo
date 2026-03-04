import Nat "mo:core/Nat";
import Order "mo:core/Order";

module {
  public type Id = Nat;
  public type Category = {
    #mobile;
    #web;
    #backend;
  };

  public type Project = {
    id : Id;
    title : Text;
    description : Text;
    category : Category;
    imageUrl : Text;
    liveUrl : Text;
    repoUrl : Text;
    tags : [Text];
    isActive : Bool;
    sortOrder : Nat;
  };

  public func compare(a : Project, b : Project) : Order.Order {
    Nat.compare(a.sortOrder, b.sortOrder);
  };
};
