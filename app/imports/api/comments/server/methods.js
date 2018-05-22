import Security from "/imports/api/security/security";
import CommentService from "./services/CommentService";

Meteor.methods({
  "comment.create"(content, accountId) {
    Security.checkLoggedIn(this.userId);
    const authorId = this.userId;
    CommentService.createComment({ content, accountId, authorId });
  }
});
