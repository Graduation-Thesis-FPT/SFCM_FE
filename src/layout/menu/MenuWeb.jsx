import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as icon from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation } from "react-router-dom";

import logo from "@/assets/image/logo-menu.svg";
import logoNoText from "@/assets/image/logo-menu-notext.svg";

export default function MenuWeb({ handleScale, isCollapse, menu }) {
  let { pathname } = useLocation();
  let mainPath = pathname.split("/")[1];
  const [accordionValue, setAccordionValue] = useState(mainPath);

  return (
    <div className="flex h-full max-h-screen flex-col gap-x-2">
      <div className="relative flex h-16 items-center justify-center border-b px-4">
        <img src={isCollapse ? logoNoText : logo} alt="logo" className="aspect-auto h-8" />
        <span className="absolute bottom-2 right-[-14px]">
          <Button
            size="icon"
            className="rounded-2 size-7 bg-white text-gray-600 shadow-md hover:bg-white/80"
            onClick={handleScale}
          >
            <icon.ChevronsLeftRight className="size-4" />
          </Button>
        </span>
      </div>

      <ScrollArea className="w-full">
        <Accordion
          className="w-full"
          type="single"
          value={isCollapse ? "" : accordionValue}
          collapsible
          onValueChange={value => {
            setAccordionValue(value);
          }}
        >
          {menu?.map((item, index) => {
            let isParentSelected = accordionValue || mainPath;
            const Icon = icon[item.MENU_ICON] ?? icon.Ellipsis;
            if (item.child?.length === 0) return null;
            return (
              <AccordionItem
                value={item.MENU_CODE}
                key={item.MENU_CODE + index}
                onClick={() => {
                  if (isCollapse) {
                    handleScale();
                  }
                }}
              >
                <AccordionTrigger
                  className={`px-3  ${isParentSelected === item.MENU_CODE ? "font-bold" : "text-gray-500 "}`}
                >
                  {!isCollapse ? (
                    <div className="flex items-center text-14">
                      <Icon className="mr-2 h-5 w-5" />
                      {item.MENU_NAME}
                    </div>
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </AccordionTrigger>

                <AccordionContent>
                  <nav className="grid items-start px-2 text-12 font-medium">
                    {item?.child?.map((child, index) => {
                      let isMenuSelected = pathname === `/${item.MENU_CODE}/${child.MENU_CODE}`;
                      return (
                        <Link
                          key={child.MENU_CODE + index}
                          to={`/${item.MENU_CODE}/${child.MENU_CODE}`}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isMenuSelected ? "bg-muted font-bold text-primary" : "text-muted-foreground"}  hover:text-primary`}
                        >
                          {child.MENU_NAME}
                        </Link>
                      );
                    })}
                  </nav>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </ScrollArea>
    </div>
  );
}
