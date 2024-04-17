import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Home,
  LineChart,
  Package,
  Package2,
  ShoppingCart,
  Users,
  IndentDecrease,
  IndentIncrease,
  ChevronDown,
  Dock,
  List,
  FolderInput,
  Ellipsis
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
const icon = {
  Bell,
  Home,
  LineChart,
  Package,
  Package2,
  ShoppingCart,
  Users,
  IndentDecrease,
  IndentIncrease,
  ChevronDown,
  Dock,
  List,
  FolderInput,
  Ellipsis
};
export default function MenuWeb({ handleScale, isCollapse }) {
  const menu = useSelector(state => state.menuSlice.menu);
  let { pathname } = useLocation();
  let mainPath = pathname.split("/")[1];
  const [accordionValue, setAccordionValue] = useState(mainPath);

  return (
    <>
      <div className="flex h-full max-h-screen flex-col gap-x-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
          {!isCollapse && (
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">CFS</span>
            </Link>
          )}
          <Button
            variant="outline"
            size="icon"
            className={`${!isCollapse && "ml-auto"} h-8 w-8`}
            onClick={handleScale}
          >
            {isCollapse ? (
              <IndentIncrease className="h-4 w-4" />
            ) : (
              <IndentDecrease className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>

        <ScrollArea className="w-full md:h-minusHeader_md lg:h-minusHeader_lg">
          <Accordion
            className="w-full"
            type="single"
            value={isCollapse ? [] : accordionValue}
            collapsible
            onValueChange={value => {
              setAccordionValue(value);
            }}
          >
            {menu?.map((item, index) => {
              let isParentSelected = accordionValue || mainPath;
              const Icon = icon[item.icon] ?? icon.Ellipsis;
              return (
                <AccordionItem
                  value={item.url}
                  key={item.url + index}
                  onClick={() => {
                    if (isCollapse) {
                      handleScale();
                    }
                  }}
                >
                  <AccordionTrigger
                    className={`px-3  ${isParentSelected === item.url ? "font-bold" : "text-gray-500 "}`}
                  >
                    {!isCollapse ? (
                      <div className="flex text-14">
                        <Icon className="mr-2 h-5 w-5" />
                        {item.name}
                      </div>
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </AccordionTrigger>

                  <AccordionContent>
                    <nav className="grid items-start px-2 text-12 font-medium ">
                      {item?.child?.map((child, index) => {
                        let isMenuSelected = pathname === `/${item.url}/${child.url}`;
                        return (
                          <Link
                            key={child.url + index}
                            to={`/${item.url}/${child.url}`}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isMenuSelected ? "bg-muted font-bold text-primary" : "text-muted-foreground"}  hover:text-primary`}
                          >
                            {child.name}
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
    </>
  );
}
