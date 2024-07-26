import { grantPermission } from "@/apis/permission";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function GrantPermission({ action, children, disableWhenUnAuth, ...props }) {
  const pathname = useLocation().pathname;
  const MENU_CODE = pathname.split("/")[2];
  const [isShow, setIsShow] = React.useState(false);

  useEffect(() => {
    grantPermission({ menuCode: MENU_CODE })
      .then(res => {
        setIsShow(res.data.metadata[action]);
      })
      .catch(err => {
        console.log(err);
      });
  }, [pathname]);

  if (!isShow) {
    if (disableWhenUnAuth) {
      return <span className="pointer-events-none opacity-30">{children}</span>;
    }
    return null;
  }

  return <>{children}</>;
}
