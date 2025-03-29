export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    if (diffDays <= 1) {
      const hours = Math.floor(diffTime / (1000 * 60 * 60));
      if (hours < 1) return "Just now";
      if (hours === 1) return "1 hour ago";
      if (hours < 24) return `${hours} hours ago`;
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString(undefined, { weekday: "long" });
    } else {
      return date.toLocaleDateString();
    }
  };