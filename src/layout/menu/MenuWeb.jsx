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
  Dock
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

export default function MenuWeb({ handleScale, isCollapse }) {
  const menu = useSelector(state => state.menuSlice.menu);
  const [accordionValue, setAccordionValue] = useState(menu?.map(({ url }) => url));

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
        <ScrollArea className="md:h-minusHeader_md lg:h-minusHeader_lg w-full">
          <Accordion
            type="multiple"
            value={isCollapse ? [] : accordionValue}
            onValueChange={value => {
              setAccordionValue(value);
            }}
            className="w-full"
          >
            <AccordionItem
              value="home"
              onClick={() => {
                if (isCollapse) {
                  handleScale();
                }
              }}
            >
              <AccordionTrigger className="px-5 text-gray-500">
                {!isCollapse ? (
                  <div className="flex">
                    <Home className="h-5 w-5 mr-2" />
                    Trang chủ
                  </div>
                ) : (
                  <Home className="h-5 w-5" />
                )}
              </AccordionTrigger>
              <AccordionContent>
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                  <Link
                    to="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/home/homePage"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    Home
                  </Link>
                  <Link
                    to="/detail/detailPage"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary bg-muted"
                  >
                    Detail
                  </Link>
                </nav>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="detail"
              onClick={() => {
                if (isCollapse) {
                  handleScale();
                }
              }}
            >
              <AccordionTrigger className="px-5">
                {!isCollapse ? (
                  <div className="flex">
                    <Home className="h-5 w-5 mr-2" />
                    Giám sát cổng
                  </div>
                ) : (
                  <Dock className="h-5 w-5" />
                )}
              </AccordionTrigger>
              <AccordionContent>
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                  <Link
                    to="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/home/homePage"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    Home
                  </Link>
                  <Link
                    to="/detail/detailPage"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary bg-muted"
                  >
                    Detail
                  </Link>
                </nav>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-2"
              onClick={() => {
                if (isCollapse) {
                  handleScale();
                }
              }}
            >
              <AccordionTrigger className="px-5">
                {!isCollapse ? (
                  <div className="flex">
                    <Home className="h-5 w-5 mr-2" />
                    Giám sát cổng
                  </div>
                ) : (
                  <Dock className="h-5 w-5" />
                )}
              </AccordionTrigger>
              <AccordionContent>
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                  <Link
                    to="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/home/homePage"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    Home
                  </Link>
                  <Link
                    to="/detail/detailPage"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary bg-muted"
                  >
                    Detail
                  </Link>
                </nav>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </div>
    </>
  );
}
