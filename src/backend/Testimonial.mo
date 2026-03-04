import Nat "mo:core/Nat";
import Order "mo:core/Order";
module {
  public type Id = Nat;
  public type Testimonial = {
    id : Id;
    name : Text;
    role : Text;
    company : Text;
    content : Text;
    avatarUrl : Text;
    rating : Nat;
    sortOrder : Nat;
  };
  public func compare(a : Testimonial, b : Testimonial) : Order.Order {
    Nat.compare(a.sortOrder, b.sortOrder);
  };
};
