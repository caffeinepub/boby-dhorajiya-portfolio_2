import Nat "mo:core/Nat";
import Order "mo:core/Order";
module {
  public type Id = Nat;
  public type Category = {
    #primary;
    #secondary;
    #security;
    #additional;
  };
  public type Skill = {
    id : Id;
    name : Text;
    category : Category;
    level : Nat;
    icon : Text;
    sortOrder : Nat;
  };

  public func compare(a : Skill, b : Skill) : Order.Order {
    Nat.compare(a.sortOrder, b.sortOrder);
  };
};
