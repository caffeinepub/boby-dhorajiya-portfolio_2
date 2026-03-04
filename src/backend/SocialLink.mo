import Nat "mo:core/Nat";
import Order "mo:core/Order";
module {
  public type Id = Nat;
  public type SocialLink = {
    id : Id;
    platform : Text;
    url : Text;
    isActive : Bool;
    sortOrder : Nat;
  };

  public func compare(a : SocialLink, b : SocialLink) : Order.Order {
    Nat.compare(a.sortOrder, b.sortOrder);
  };
};
