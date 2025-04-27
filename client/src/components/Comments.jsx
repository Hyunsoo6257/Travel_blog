import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

function Comments({ user, articleId, comments, setComments }) {
  return (
    <div className="mt-16 border-t border-gray-200 pt-12">
      <h2 className="text-xs tracking-[0.2em] text-gray-600 font-light mb-8">
        COMMENTS ({comments.length})
      </h2>

      {user ? (
        <CommentForm
          user={user}
          articleId={articleId}
          comments={comments}
          setComments={setComments}
        />
      ) : (
        <LoginPrompt />
      )}

      <CommentList comments={comments} setComments={setComments} user={user} />
    </div>
  );
}

const LoginPrompt = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 text-center mb-12">
      <p className="text-sm font-light text-gray-600 mb-4">
        Please log in to join the discussion
      </p>
      <Button
        onClick={() => navigate("/login")}
        className="text-xs tracking-[0.2em]"
      >
        LOGIN
      </Button>
    </div>
  );
};

export default Comments;
