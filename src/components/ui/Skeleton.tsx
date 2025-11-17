import React from "react";

interface SkeletonProps {
  width?: string;
  height?: string;
  count?: number;
  circle?: boolean;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "1rem",
  count = 1,
  circle = false,
  className = "",
}) => {
  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, i) => (
        <div
          key={i}
          className={`bg-gray-200 animate-pulse mb-2 ${
            circle ? "rounded-full" : "rounded"
          } ${className}`}
          style={{
            width,
            height,
          }}
        />
      ))}
    </>
  );
};

interface SkeletonCardProps {
  count?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ count = 1 }) => {
  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-md overflow-hidden p-6 space-y-4"
        >
          <Skeleton height="200px" className="mb-4" />
          <Skeleton height="1.5rem" />
          <Skeleton height="1rem" />
          <Skeleton height="1rem" width="60%" />
          <div className="flex gap-2 pt-2">
            <Skeleton height="2.5rem" width="50%" />
            <Skeleton height="2.5rem" width="50%" />
          </div>
        </div>
      ))}
    </>
  );
};
