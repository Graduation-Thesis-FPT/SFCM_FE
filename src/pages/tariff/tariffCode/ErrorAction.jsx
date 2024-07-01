import { useState } from "react";

export function ErrorAction({ result = [], ...props }) {
  const [isShow, setIsShow] = useState(false);
  return (
    <span
      onMouseEnter={() => {
        setIsShow(true);
      }}
      onMouseLeave={() => {
        setIsShow(false);
      }}
    >
      Dữ liệu không hợp lệ
      {isShow && (
        <>
          {result.map((item, index) => (
            <div key={index}>- {item.message}</div>
          ))}
        </>
      )}
    </span>
  );
}
