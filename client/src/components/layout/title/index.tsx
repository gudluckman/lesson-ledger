import React from "react";
import { useRouterContext, TitleProps } from "@pankod/refine-core";
import { Button } from "@pankod/refine-mui";

import smaller_logo from "../../../assets/lesson_ledger_logo.png";

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  const { Link } = useRouterContext();

  return (
    <Button fullWidth variant="text" disableRipple>
      <Link to="/">
        <div style={{ display: "flex", alignItems: "center" }}>
          {collapsed ? (
            <>
              <img src={smaller_logo} alt="LessonLedger" width="28px" />
            </>
          ) : (
            <>
              <img
                src={smaller_logo}
                alt="Refine"
                width="30px"
                style={{
                  marginRight: '10px'
                }}
              />
              <span style={{fontFamily: 'Georgia', fontSize: '16px'}}>Lesson Ledger</span>
            </>
          )}
        </div>
      </Link>
    </Button>
  );
};
