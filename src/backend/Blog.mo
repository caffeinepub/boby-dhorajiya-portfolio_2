import Int "mo:core/Int";
import Order "mo:core/Order";
module {
  public type Id = Nat;
  public type BlogPost = {
    id : Id;
    title : Text;
    slug : Text;
    content : Text;
    excerpt : Text;
    coverImage : Text;
    tags : [Text];
    publishedAt : Int;
    isPublished : Bool;
  };

  public func compareByPublishedAt(a : BlogPost, b : BlogPost) : Order.Order {
    Int.compare(b.publishedAt, a.publishedAt);
  };
};
