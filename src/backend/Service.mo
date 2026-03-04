import Nat "mo:core/Nat";
import Order "mo:core/Order";
module {
  public type Id = Nat;
  public type Service = {
    id : Id;
    title : Text;
    description : Text;
    icon : Text;
    sortOrder : Nat;
  };

  public func compare(a : Service, b : Service) : Order.Order {
    Nat.compare(a.sortOrder, b.sortOrder);
  };
};
