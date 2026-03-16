
export default function Rating({ value }) {

  const stars = [];

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i}>
        {value >= i ? "⭐" : "☆"}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1 text-yellow-500">
      {stars}
    </div>
  );
}

