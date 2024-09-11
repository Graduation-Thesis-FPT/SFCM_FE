import { MAIN_MENU } from "@/constants/menu";

export const categorizedMenu = menu => {
  let mainMenu = [];
  let toolMenu = [];

  mainMenu = menu.filter(item => MAIN_MENU.includes(item.ID));
  toolMenu = menu.filter(item => !MAIN_MENU.includes(item.ID));

  return { mainMenu, toolMenu };
};

export const getRoutes = menu => {
  let routes = [];
  menu.forEach(parent => {
    if (parent?.child?.length !== 0) {
      parent.child.forEach(child => {
        routes.push({ path: `/${parent.ID}/${child.ID}`, element: child.PAGE_COMPONENT });
      });
    }
  });
  return routes;
};
