import Nat "mo:core/Nat";
import Order "mo:core/Order";
module {
  public type Id = Nat;
  public type Experience = {
    id : Id;
    title : Text;
    company : Text;
    duration : Text;
    description : Text;
    sortOrder : Nat;
  };

  public func compare(a : Experience, b : Experience) : Order.Order {
    Nat.compare(a.sortOrder, b.sortOrder);
  };
};
