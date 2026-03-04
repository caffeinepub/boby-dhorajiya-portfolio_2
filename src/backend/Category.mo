import Nat "mo:core/Nat";
import Order "mo:core/Order";
module {
  public type Id = Nat;
  public type Category = {
    id : Id;
    name : Text;
    sortOrder : Nat;
  };
  public func compare(a : Category, b : Category) : Order.Order {
    Nat.compare(a.sortOrder, b.sortOrder);
  };
};
