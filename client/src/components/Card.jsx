import { useNavigate } from "react-router-dom";

function Card({
  id,
  category,
  title,
  description,
  author,
  authorRole,
  image,
  authorImage,
}) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/article/${id}`)}
      className="group cursor-pointer"
    >
      {/* Main Image */}
      <div className="aspect-[4/3] overflow-hidden mb-4">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div>
        <div className="text-xs tracking-[0.2em] text-gray-600 mb-3 font-light">
          {category.toUpperCase()}
        </div>

        <h3 className="font-serif text-xl font-bold mb-3 leading-tight group-hover:text-gray-600">
          {title}
        </h3>

        <p className="text-sm tracking-wide text-gray-600 leading-relaxed mb-4 font-light">
          {description}
        </p>

        {/* Author Info with Profile Image */}
        <div className="flex items-center space-x-3 border-t border-gray-200 pt-4">
          {/* Profile Image */}
          <div className="w-7 h-7 rounded-full overflow-hidden bg-[#F7F3EE]">
            {authorImage ? (
              <img
                src={authorImage}
                alt={author}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xs font-serif">
                  {author?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Author Details */}
          <div className="flex items-center space-x-2">
            <span className="text-xs tracking-[0.1em] font-light">
              BY <span className="font-serif">{author.toUpperCase()}</span>
            </span>
            <span className="text-gray-400 text-xs">·</span>
            <span className="text-xs tracking-[0.1em] text-gray-500 font-light">
              {authorRole.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
