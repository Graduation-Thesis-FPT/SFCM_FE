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
    <div className="flex h-full max-h-screen flex-col gap-x-2 shadow-md">
      <div className="relative flex h-16 items-center justify-center border-b px-4">
        <img src={isCollapse ? logoNoText : logo} alt="logo" className="aspect-auto h-8" />
        <div className="absolute bottom-2 right-[-14px]">
          <Button
            size="icon"
            className="rounded-2 size-7 bg-white text-gray-600 shadow-md hover:bg-white/80"
            onClick={handleScale}
          >
            <icon.ChevronsLeftRight className="size-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="w-full flex-1 px-[24px] pt-[24px]">
        <span className={`${isCollapse && "hidden"} mb-2 text-13 font-normal text-gray-500`}>
          Mục chính
        </span>
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
            if (
              !(
                item.MENU_CODE === "user-manager" ||
                item.MENU_CODE === "generic-list" ||
                item.MENU_CODE === "input-data" ||
                item.MENU_CODE === "tariff" ||
                item.MENU_CODE === "procedure" ||
                item.MENU_CODE === "gate-operation" ||
                item.MENU_CODE === "query-info"
              )
            )
              return null;
            return (
              <AccordionItem
                className="border-hidden"
                value={item.MENU_CODE}
                key={item.MENU_CODE + index}
                onClick={() => {
                  if (isCollapse) {
                    handleScale();
                  }
                }}
              >
                <AccordionTrigger
                  className={`py-2.5 hover:text-blue-800 ${isParentSelected === item.MENU_CODE ? "text-blue-700" : "text-gray-500"}`}
                >
                  {!isCollapse ? (
                    <div className="flex items-center gap-2 text-14">
                      <Icon size={16} className="flex-1" />
                      {item.MENU_NAME}
                    </div>
                  ) : (
                    <Icon size={16} />
                  )}
                </AccordionTrigger>

                <AccordionContent>
                  <nav className="ml-3 grid items-start border-l-2 border-l-gray-300 pl-2 text-13 font-medium">
                    {item?.child?.map((child, index) => {
                      let isMenuSelected = pathname === `/${item.MENU_CODE}/${child.MENU_CODE}`;
                      return (
                        <Link
                          key={child.MENU_CODE + index}
                          to={`/${item.MENU_CODE}/${child.MENU_CODE}`}
                          className={`flex items-center gap-3 rounded-md px-3 py-1.5 transition-all ${isMenuSelected ? "text-blue-700" : "text-muted-foreground"}  hover:bg-muted hover:text-blue-700`}
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
        <p className={`${isCollapse && "hidden"} mb-2 mt-4 text-13 font-normal text-gray-500`}>
          Công cụ
        </p>
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
            if (!(item.MENU_CODE === "report" || item.MENU_CODE === "query-info")) return null;
            return (
              <AccordionItem
                className="border-hidden"
                value={item.MENU_CODE}
                key={item.MENU_CODE + index}
                onClick={() => {
                  if (isCollapse) {
                    handleScale();
                  }
                }}
              >
                <AccordionTrigger
                  className={`py-2.5 hover:text-blue-800 ${isParentSelected === item.MENU_CODE ? "text-blue-700" : "text-gray-500"}`}
                >
                  {!isCollapse ? (
                    <div className="flex items-center gap-2 text-14">
                      <Icon size={16} className="flex-1" />
                      {item.MENU_NAME}
                    </div>
                  ) : (
                    <Icon size={16} />
                  )}
                </AccordionTrigger>

                <AccordionContent>
                  <nav className="ml-3 grid items-start border-l-2 border-l-gray-300 pl-2 text-13 font-medium">
                    {item?.child?.map((child, index) => {
                      let isMenuSelected = pathname === `/${item.MENU_CODE}/${child.MENU_CODE}`;
                      return (
                        <Link
                          key={child.MENU_CODE + index}
                          to={`/${item.MENU_CODE}/${child.MENU_CODE}`}
                          className={`flex items-center gap-3 rounded-md px-3 py-1.5 transition-all ${isMenuSelected ? "text-blue-700" : "text-muted-foreground"}  hover:bg-muted hover:text-blue-700`}
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

      <div className="flex h-16 items-center justify-center border-t px-6">
        <p className="text-12 font-normal text-gray-600">
          {isCollapse ? "©2024 SFCM." : "©2024 SFCM. All right reserved"}
        </p>
      </div>
    </div>
  );
}
