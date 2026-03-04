import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Int "mo:core/Int";
module {
  public type Id = Nat;
  public type Contact = {
    id : Id;
    name : Text;
    email : Text;
    message : Text;
    createdAt : Time.Time;
  };
  public func compareByCreatedAt(a : Contact, b : Contact) : Order.Order {
    Int.compare(b.createdAt, a.createdAt);
  };
};
