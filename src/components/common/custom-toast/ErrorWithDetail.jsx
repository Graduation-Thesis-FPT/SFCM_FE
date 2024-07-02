import { useState } from "react";

export function ErrorWithDetail({ mess = [], ...props }) {
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
          {mess.map(item => (
            <div key={item}>- {item}</div>
          ))}
        </>
      )}
    </span>
  );
}
