import logoNoText from "@/assets/image/logo-menu-notext.svg";
import logo from "@/assets/image/logo-menu.svg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/common/ui/accordion";
import { Button } from "@/components/common/ui/button";
import { ScrollArea } from "@/components/common/ui/scroll-area";
import { categorizedMenu } from "@/lib/menu";
import * as icon from "lucide-react";
import React, { Fragment, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const CategorizedMenu = ({ menu, title, isCollapse, handleScale }) => {
  let { pathname } = useLocation();
  let mainPath = pathname.split("/")[1];
  const [accordionValue, setAccordionValue] = useState(mainPath);
  return (
    <Fragment>
      <p className={`${isCollapse && "hidden"} mb-2 mt-4 text-13 font-normal text-gray-500`}>
        {title}
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

          return (
            <AccordionItem
              className="border-hidden"
              value={item.ID}
              key={item.ID + index}
              onClick={() => {
                if (isCollapse) {
                  handleScale();
                }
              }}
            >
              <AccordionTrigger
                className={`py-2.5 hover:text-blue-800 ${isParentSelected === item.ID ? "text-blue-700" : "text-gray-500"}`}
              >
                {!isCollapse ? (
                  <div className="flex items-center gap-2 text-14">
                    <Icon size={16} />
                    <p className="line-clamp-1 flex-1">{item.NAME}</p>
                  </div>
                ) : (
                  <Icon size={16} />
                )}
              </AccordionTrigger>

              <AccordionContent>
                <nav className="ml-3 grid items-start border-l-2 border-l-gray-300 pl-2 text-13 font-medium">
                  {item?.child?.map((child, index) => {
                    let isMenuSelected = pathname === `/${item.ID}/${child.ID}`;
                    return (
                      <Link
                        key={child.ID + index}
                        to={`/${item.ID}/${child.ID}`}
                        className={`flex items-center gap-3 rounded-md px-3 py-1.5 transition-all ${isMenuSelected ? "text-blue-700" : "text-muted-foreground"}  hover:bg-muted hover:text-blue-700`}
                      >
                        <p className="line-clamp-1">{child.NAME}</p>
                      </Link>
                    );
                  })}
                </nav>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Fragment>
  );
};

export function Sidebar({ handleScale, isCollapse, menu }) {
  const { mainMenu, toolMenu } = categorizedMenu(menu);
  return (
    <div className="flex h-full max-h-screen flex-col gap-x-2 shadow-md">
      <div className="relative flex max-h-16 min-h-16 items-center justify-center border-b px-4">
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
        <CategorizedMenu
          menu={mainMenu}
          title="Mục chính"
          isCollapse={isCollapse}
          handleScale={handleScale}
        />
        <CategorizedMenu
          menu={toolMenu}
          title="Công cụ"
          isCollapse={isCollapse}
          handleScale={handleScale}
        />
      </ScrollArea>

      <div className="flex h-16 items-center justify-center border-t px-6">
        <p className="text-12 font-normal text-gray-600">
          {isCollapse ? "©2024 SFCM." : "©2024 SFCM. All rights reserved"}
        </p>
      </div>
    </div>
  );
}
